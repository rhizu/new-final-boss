// src/utils/utils.js

export const calculateTimePerSign = (signsPerformed, totalSeconds) => {
  const totalCount = signsPerformed.reduce((acc, s) => acc + s.count, 0);
  return signsPerformed.map((s) => ({
    SignDetected: s.SignDetected,
    count: s.count,
    timeSpent:
      totalCount > 0
        ? Math.round(((s.count / totalCount) * totalSeconds) / 60)
        : 0, // in minutes
  }));
};
