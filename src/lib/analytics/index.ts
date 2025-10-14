type ToolUsageData = {
  usageCount: number;
  maxUsage: number;
  isPro: boolean;
  isAuthenticated: boolean;
};

function trackToolUsage(data: ToolUsageData) {
  const tool = 'spell checker';
  window.dispatchEvent(
    new CustomEvent('sg:tool-usage', {
      detail: { tool, ...data },
    })
  );
}

export const analytics = {
  toolUsage: trackToolUsage,
};

export default analytics;
