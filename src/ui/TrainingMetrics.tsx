// ui/TrainingMetrics.tsx
import { useEffect, useRef, useState } from 'react';
import { metricsTracker, type TrainingMetrics } from '../rl/metricsTracker';
import { evaluateLearning, type EvaluationResults } from '../rl/evaluation';


interface TrainingMetricsProps {
    currentEpisode: number;
}

export function TrainingMetrics({ currentEpisode }: TrainingMetricsProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [metrics, setMetrics] = useState<TrainingMetrics | null>(null);
    const [selectedChart, setSelectedChart] = useState<'reward' | 'success' | 'steps'>('reward');
    const [evaluation, setEvaluation] = useState<EvaluationResults | null>(null);
    const [isEvaluating, setIsEvaluating] = useState(false);

    // Update metrics when episode changes
    useEffect(() => {
        const updatedMetrics = metricsTracker.getMetrics();
        setMetrics(updatedMetrics);
    }, [currentEpisode]);

    // Draw chart on canvas
    useEffect(() => {
        if (!canvasRef.current || !metrics || metrics.episodes.length === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const episodes = metrics.episodes;
        const padding = 40;
        const width = canvas.width - padding * 2;
        const height = canvas.height - padding * 2;

        // Determine data to plot based on selected chart
        let data: number[] = [];
        let label = '';
        let yMin = 0;
        let yMax = 100;

        if (selectedChart === 'reward') {
            data = episodes.map(e => e.totalReward);
            label = 'Total Reward';
            yMin = Math.min(...data, 0);
            yMax = Math.max(...data, 1);
        } else if (selectedChart === 'success') {
            data = metricsTracker.getSuccessRateOverTime(10);
            label = 'Success Rate (%)';
            yMin = 0;
            yMax = 100;
        } else if (selectedChart === 'steps') {
            data = episodes.map(e => e.stepCount);
            label = 'Steps per Episode';
            yMin = 0;
            yMax = Math.max(...data, 1);
        }

        const xScale = width / Math.max(data.length - 1, 1);
        const yScale = height / (yMax - yMin || 1);

        // Draw axes
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, padding + height);
        ctx.lineTo(padding + width, padding + height);
        ctx.stroke();

        // Draw grid
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= 5; i++) {
            const y = padding + (height / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(padding + width, y);
            ctx.stroke();
        }

        // Draw Y-axis labels
        ctx.fillStyle = '#aaa';
        ctx.font = '10px monospace';
        ctx.textAlign = 'right';
        for (let i = 0; i <= 5; i++) {
            const value = yMax - (yMax - yMin) * (i / 5);
            const y = padding + (height / 5) * i;
            ctx.fillText(value.toFixed(1), padding - 5, y + 3);
        }

        // Draw X-axis labels
        ctx.textAlign = 'center';
        const numXLabels = Math.min(5, data.length);
        for (let i = 0; i <= numXLabels; i++) {
            const episodeIdx = Math.floor((data.length - 1) * (i / numXLabels));
            const x = padding + episodeIdx * xScale;
            ctx.fillText(`${episodeIdx}`, x, padding + height + 15);
        }

        // Draw chart title
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(label, canvas.width / 2, 20);

        // Draw data line
        if (data.length > 0) {
            ctx.strokeStyle = '#4CAF50';
            ctx.lineWidth = 2;
            ctx.beginPath();
            data.forEach((value, i) => {
                const x = padding + i * xScale;
                const y = padding + height - (value - yMin) * yScale;
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            ctx.stroke();

            // Draw points
            ctx.fillStyle = '#4CAF50';
            data.forEach((value, i) => {
                const x = padding + i * xScale;
                const y = padding + height - (value - yMin) * yScale;
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fill();
            });
        }
    }, [metrics, selectedChart]);

    const handleEvaluate = async () => {
        setIsEvaluating(true);
        try {
            const results = await evaluateLearning(100);
            setEvaluation(results);
        } catch (error) {
            console.error('Evaluation failed:', error);
        } finally {
            setIsEvaluating(false);
        }
    };

    if (!metrics || metrics.episodes.length === 0) {
        return (
            <div style={{
                position: 'absolute',
                top: 10,
                right: 10,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                padding: '15px',
                borderRadius: '8px',
                fontSize: '12px',
                width: '300px',
                zIndex: 10,
            }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Training Metrics</h3>
                <p>Run episodes to see metrics...</p>
            </div>
        );
    }

    return (
        <div style={{
            position: 'absolute',
            top: 10,
            right: 10,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            padding: '15px',
            borderRadius: '8px',
            fontSize: '11px',
            width: '400px',
            maxHeight: '90vh',
            overflowY: 'auto',
            zIndex: 10,
        }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 'bold' }}>
                Training Metrics
            </h3>

            {/* Summary Stats */}
            <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                padding: '10px',
                borderRadius: '5px',
                marginBottom: '10px'
            }}>
                <div><strong>Total Episodes:</strong> {metrics.totalEpisodes}</div>
                <div><strong>Success Rate:</strong> {metrics.successRate.toFixed(1)}%</div>
                <div><strong>Avg Reward:</strong> {metrics.avgReward.toFixed(2)}</div>
                <div><strong>Avg Steps:</strong> {metrics.avgSteps.toFixed(1)}</div>
                <div><strong>Avg Q-Value:</strong> {metrics.avgQValue.toFixed(3)}</div>
            </div>

            {/* Chart Selection */}
            <div style={{ marginBottom: '10px', display: 'flex', gap: '5px' }}>
                <button
                    onClick={() => setSelectedChart('reward')}
                    style={{
                        flex: 1,
                        padding: '5px',
                        backgroundColor: selectedChart === 'reward' ? '#4CAF50' : '#333',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontSize: '10px',
                    }}
                >
                    Reward
                </button>
                <button
                    onClick={() => setSelectedChart('success')}
                    style={{
                        flex: 1,
                        padding: '5px',
                        backgroundColor: selectedChart === 'success' ? '#4CAF50' : '#333',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontSize: '10px',
                    }}
                >
                    Success %
                </button>
                <button
                    onClick={() => setSelectedChart('steps')}
                    style={{
                        flex: 1,
                        padding: '5px',
                        backgroundColor: selectedChart === 'steps' ? '#4CAF50' : '#333',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontSize: '10px',
                    }}
                >
                    Steps
                </button>
            </div>

            {/* Canvas Chart */}
            <canvas
                ref={canvasRef}
                width={370}
                height={200}
                style={{
                    backgroundColor: '#1a1a1a',
                    borderRadius: '5px',
                    marginBottom: '10px',
                }}
            />

            {/* Evaluation Button */}
            <button
                onClick={handleEvaluate}
                disabled={isEvaluating}
                style={{
                    width: '100%',
                    padding: '8px',
                    backgroundColor: isEvaluating ? '#666' : '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: isEvaluating ? 'not-allowed' : 'pointer',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    marginBottom: '10px',
                }}
            >
                {isEvaluating ? 'Evaluating...' : 'Run Final Evaluation'}
            </button>

            {/* Evaluation Results */}
            {evaluation && (
                <div style={{
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #2196F3',
                }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '12px' }}>Evaluation Results</h4>

                    <div style={{ marginBottom: '8px' }}>
                        <strong>Learned Policy:</strong>
                        <div style={{ marginLeft: '10px', fontSize: '10px' }}>
                            <div>Avg Reward: {evaluation.learnedPolicy.avgReward.toFixed(2)}</div>
                            <div>Success Rate: {evaluation.learnedPolicy.successRate.toFixed(1)}%</div>
                            <div>Avg Steps: {evaluation.learnedPolicy.avgSteps.toFixed(1)}</div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '8px' }}>
                        <strong>Random Baseline:</strong>
                        <div style={{ marginLeft: '10px', fontSize: '10px' }}>
                            <div>Avg Reward: {evaluation.randomBaseline.avgReward.toFixed(2)}</div>
                            <div>Success Rate: {evaluation.randomBaseline.successRate.toFixed(1)}%</div>
                            <div>Avg Steps: {evaluation.randomBaseline.avgSteps.toFixed(1)}</div>
                        </div>
                    </div>

                    <div style={{
                        padding: '5px',
                        backgroundColor: evaluation.improvement > 0 ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
                        borderRadius: '3px',
                        textAlign: 'center',
                    }}>
                        <strong>Improvement: {evaluation.improvement > 0 ? '+' : ''}{evaluation.improvement.toFixed(1)}%</strong>
                    </div>
                </div>
            )}
        </div>
    );
}
