// rl/evaluation.ts
import { step } from '../simulation/step';
import { resetEnvironment } from '../simulation/reset';
import { AgentAction } from '../simulation/actions';
import { metricsTracker, type TrainingMetrics } from './metricsTracker';
import { randomBaseline } from './baseline';
import { Q } from './qTable';


export interface EvaluationResults {
    learnedPolicy: PolicyResults;
    randomBaseline: PolicyResults;
    improvement: number; // percentage improvement over baseline
}

export interface PolicyResults {
    avgReward: number;
    successRate: number;
    avgSteps: number;
    totalEpisodes: number;
}

/**
 * Evaluate a policy by running episodes without learning
 */
async function evaluatePolicy(
    actionSelector: (agentId: string) => AgentAction,
    numEpisodes: number = 100
): Promise<PolicyResults> {
    let totalReward = 0;
    let successCount = 0;
    let totalSteps = 0;

    for (let ep = 0; ep < numEpisodes; ep++) {
        resetEnvironment();
        let done = false;
        let stepCount = 0;
        let episodeReward = 0;

        while (!done && stepCount < 100) {
            const actions: Record<string, AgentAction> = {
                thief: actionSelector('thief'),
                guardian: actionSelector('guardian'),
                negotiator: actionSelector('negotiator'),
                AgentX: actionSelector('AgentX'),
            };

            const { rewards, done: episodeDone } = step(actions);

            episodeReward += Object.values(rewards).reduce((sum, r) => sum + r, 0);
            stepCount++;
            done = episodeDone;
        }

        totalReward += episodeReward;
        totalSteps += stepCount;
        if (done && stepCount < 100) {
            successCount++;
        }
    }

    return {
        avgReward: totalReward / numEpisodes,
        successRate: (successCount / numEpisodes) * 100,
        avgSteps: totalSteps / numEpisodes,
        totalEpisodes: numEpisodes,
    };
}

/**
 * Evaluate the learned Q-learning policy against random baseline
 */
export async function evaluateLearning(numEpisodes: number = 100): Promise<EvaluationResults> {
    console.log('Evaluating learned policy...');

    // Evaluate learned Q-learning policy (greedy, no exploration)
    const learnedResults = await evaluatePolicy(
        (agentId: string) => {
            const q = Q[agentId];
            const maxIdx = q.indexOf(Math.max(...q));
            const actions: AgentAction[] = ['go_plate_0', 'go_plate_1', 'go_plate_2', 'go_vault', 'wait'];
            return actions[maxIdx];
        },
        numEpisodes
    );

    console.log('Evaluating random baseline...');

    // Evaluate random baseline
    const baselineResults = await evaluatePolicy(
        (agentId: string) => randomBaseline.selectAction(agentId),
        numEpisodes
    );

    // Calculate improvement
    const improvement = baselineResults.avgReward !== 0
        ? ((learnedResults.avgReward - baselineResults.avgReward) / Math.abs(baselineResults.avgReward)) * 100
        : 0;

    return {
        learnedPolicy: learnedResults,
        randomBaseline: baselineResults,
        improvement,
    };
}

/**
 * Get summary statistics from training metrics
 */
export function getFinalMetrics(): TrainingMetrics {
    return metricsTracker.getMetrics();
}

/**
 * Print evaluation results to console
 */
export function printEvaluationResults(results: EvaluationResults): void {
    console.log('\n=== Evaluation Results ===');
    console.log('\nLearned Policy:');
    console.log(`  Avg Reward: ${results.learnedPolicy.avgReward.toFixed(2)}`);
    console.log(`  Success Rate: ${results.learnedPolicy.successRate.toFixed(1)}%`);
    console.log(`  Avg Steps: ${results.learnedPolicy.avgSteps.toFixed(1)}`);

    console.log('\nRandom Baseline:');
    console.log(`  Avg Reward: ${results.randomBaseline.avgReward.toFixed(2)}`);
    console.log(`  Success Rate: ${results.randomBaseline.successRate.toFixed(1)}%`);
    console.log(`  Avg Steps: ${results.randomBaseline.avgSteps.toFixed(1)}`);

    console.log(`\nImprovement: ${results.improvement > 0 ? '+' : ''}${results.improvement.toFixed(1)}%`);
    console.log('========================\n');
}
