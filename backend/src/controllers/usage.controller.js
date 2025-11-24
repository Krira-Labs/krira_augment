import User from "../models/auth.model.js";
import { Chatbot } from "../models/chatbot.model.js";
import { getPlanDefinition } from "../lib/plan.js";
import { getUsageSeries } from "../services/usage.service.js";

const formatDate = (date) => {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
};

export const getUsageSummary = async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "plan questionLimit questionsUsed chatbotLimit chatbotsCreated storageLimitMb storageUsedMb"
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const plan = getPlanDefinition(user.plan);
  const activePipelines = await Chatbot.countDocuments({
    userId: user._id,
    $or: [{ isCompleted: true }, { isCompleted: { $exists: false } }],
  });
  const trend = await getUsageSeries(user._id, 14);

  const response = {
    plan: {
      id: plan.id,
      name: plan.displayName,
      requestLimit: plan.questionLimit,
      pipelineLimit: plan.chatbotLimit,
      storageLimitMb: plan.storageLimitMb,
      providers: plan.providers,
      vectorStores: plan.vectorStores,
      embeddingModels: plan.embeddingModels,
      isFree: Boolean(plan.isFree),
      comingSoon: Boolean(plan.comingSoon),
    },
    usage: {
      requestsUsed: user.questionsUsed ?? 0,
      requestLimit: user.questionLimit ?? plan.questionLimit,
      pipelinesUsed: activePipelines,
      pipelineLimit: user.chatbotLimit ?? plan.chatbotLimit,
      storageUsedMb: user.storageUsedMb ?? 0,
      storageLimitMb: user.storageLimitMb ?? plan.storageLimitMb,
    },
    trend: trend.map((entry) => ({
      date: formatDate(entry.date),
      requests: entry.requests,
      tokens: entry.tokens,
    })),
  };

  return res.status(200).json(response);
};
