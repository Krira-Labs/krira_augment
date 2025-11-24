import User from "../models/auth.model.js";
import { UsageSnapshot } from "../models/usageSnapshot.model.js";
import { getPlanDefinition } from "../lib/plan.js";
import { redisClient } from "../utils/redis.js";

const MS_IN_DAY = 24 * 60 * 60 * 1000;

const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const ensureRequestCapacity = (user, amount = 1) => {
  const plan = getPlanDefinition(user.plan);
  const limit = user.questionLimit ?? plan.questionLimit ?? 0;

  if (limit <= 0) {
    const error = new Error("Your current plan does not include request capacity. Upgrade to continue.");
    error.statusCode = 402;
    throw error;
  }

  if ((user.questionsUsed ?? 0) + amount > limit) {
    const error = new Error("Monthly request limit reached. Upgrade your plan to continue.");
    error.statusCode = 402;
    throw error;
  }
};

export const consumeRequests = async (user, amount = 1, metadata = {}) => {
  ensureRequestCapacity(user, amount);

  await User.updateOne({ _id: user._id }, { $inc: { questionsUsed: amount } });
  user.questionsUsed = (user.questionsUsed ?? 0) + amount;

  await redisClient.cacheUser(user._id.toString(), user);

  const today = startOfDay(new Date());
  const incPayload = { requests: amount };
  if (metadata.tokens) {
    incPayload.tokens = metadata.tokens;
  }

  await UsageSnapshot.findOneAndUpdate(
    { userId: user._id, day: today },
    { $inc: incPayload },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

export const getUsageSeries = async (userId, days = 14) => {
  const end = startOfDay(new Date());
  const start = new Date(end.getTime() - (days - 1) * MS_IN_DAY);

  const snapshots = await UsageSnapshot.find({
    userId,
    day: { $gte: start },
  })
    .sort({ day: 1 })
    .lean();

  const byDay = snapshots.reduce((acc, snapshot) => {
    acc[startOfDay(snapshot.day).toISOString()] = snapshot;
    return acc;
  }, {});

  const series = [];
  for (let i = 0; i < days; i += 1) {
    const currentDay = new Date(start.getTime() + i * MS_IN_DAY);
    currentDay.setHours(0, 0, 0, 0);
    const iso = currentDay.toISOString();
    const snapshot = byDay[iso];
    series.push({
      date: currentDay,
      requests: snapshot?.requests ?? 0,
      tokens: snapshot?.tokens ?? 0,
    });
  }

  return series;
};
