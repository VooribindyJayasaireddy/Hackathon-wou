// rl/metricsTracker.ts
export interface EpisodeMetrics {
    episodeNum: number;
    totalReward: number;
    agentRewards: Record<string, number>;
    stepCount: number;
    success: boolean;
    vaultOpened: boolean;
    crystalOwner: string | null;
    avgQValue: number;
    maxQValue: number;
    minQValue: number;
}

export interface TrainingMetrics {
    episodes: EpisodeMetrics[];
    totalEpisodes: number;
    successRate: number;
    avgReward: number;
    avgSteps: number;
    avgQValue: number;
}

class MetricsTracker {
    private episodes: EpisodeMetrics[] = [];

    recordEpisode(
        episodeNum: number,
        rewards: Record<string, number>,
        stepCount: number,
        success: boolean,
        vaultOpened: boolean,
        crystalOwner: string | null,
        qValues: Record<string, number[]>
    ): void {
        // Calculate total reward across all agents
        const totalReward = Object.values(rewards).reduce((sum, r) => sum + r, 0);

        // Calculate Q-value statistics
        const allQValues = Object.values(qValues).flat();
        const avgQValue = allQValues.reduce((sum, q) => sum + q, 0) / allQValues.length;
        const maxQValue = Math.max(...allQValues);
        const minQValue = Math.min(...allQValues);

        this.episodes.push({
            episodeNum,
            totalReward,
            agentRewards: { ...rewards },
            stepCount,
            success,
            vaultOpened,
            crystalOwner,
            avgQValue,
            maxQValue,
            minQValue,
        });
    }

    getMetrics(): TrainingMetrics {
        if (this.episodes.length === 0) {
            return {
                episodes: [],
                totalEpisodes: 0,
                successRate: 0,
                avgReward: 0,
                avgSteps: 0,
                avgQValue: 0,
            };
        }

        const totalEpisodes = this.episodes.length;
        const successCount = this.episodes.filter(e => e.success).length;
        const successRate = (successCount / totalEpisodes) * 100;

        const avgReward = this.episodes.reduce((sum, e) => sum + e.totalReward, 0) / totalEpisodes;
        const avgSteps = this.episodes.reduce((sum, e) => sum + e.stepCount, 0) / totalEpisodes;
        const avgQValue = this.episodes.reduce((sum, e) => sum + e.avgQValue, 0) / totalEpisodes;

        return {
            episodes: [...this.episodes],
            totalEpisodes,
            successRate,
            avgReward,
            avgSteps,
            avgQValue,
        };
    }

    getEpisodes(): EpisodeMetrics[] {
        return [...this.episodes];
    }

    resetMetrics(): void {
        this.episodes = [];
    }

    exportMetrics(): string {
        return JSON.stringify(this.getMetrics(), null, 2);
    }

    // Get moving average for smoother visualization
    getMovingAverage(window: number = 10): number[] {
        const rewards = this.episodes.map(e => e.totalReward);
        const movingAvg: number[] = [];

        for (let i = 0; i < rewards.length; i++) {
            const start = Math.max(0, i - window + 1);
            const windowData = rewards.slice(start, i + 1);
            const avg = windowData.reduce((sum, r) => sum + r, 0) / windowData.length;
            movingAvg.push(avg);
        }

        return movingAvg;
    }

    // Get success rate over time (rolling window)
    getSuccessRateOverTime(window: number = 10): number[] {
        const successRates: number[] = [];

        for (let i = 0; i < this.episodes.length; i++) {
            const start = Math.max(0, i - window + 1);
            const windowEpisodes = this.episodes.slice(start, i + 1);
            const successCount = windowEpisodes.filter(e => e.success).length;
            const rate = (successCount / windowEpisodes.length) * 100;
            successRates.push(rate);
        }

        return successRates;
    }
}

// Singleton instance
export const metricsTracker = new MetricsTracker();
