/**
 * FlowArrows Component
 * SVG overlay for material flow indicators
 * @requirement P3-PG-FLOOR-011 Flow arrows (material flow)
 */

import { useMemo } from 'react';
import { type PlacedDepartment, calculateFlowEfficiency } from '@mocks/floor-layout';

const GRID_CELL_SIZE = 40;

interface FlowArrowsProps {
    departments: PlacedDepartment[];
    activeFloorIndex: number;
    visible: boolean;
    className?: string;
}

export function FlowArrows({
    departments,
    activeFloorIndex,
    visible,
    className = '',
}: FlowArrowsProps) {
    // Filter departments for active floor
    const floorDepartments = useMemo(
        () => departments.filter(d => d.floorIndex === activeFloorIndex),
        [departments, activeFloorIndex]
    );

    // Calculate flow connections
    const connections = useMemo(
        () => calculateFlowEfficiency(floorDepartments),
        [floorDepartments]
    );

    if (!visible || connections.length === 0) return null;

    const getArrowColor = (efficiency: number): string => {
        if (efficiency >= 0.8) return '#10B981'; // Green - good
        if (efficiency >= 0.6) return '#F59E0B'; // Yellow - okay
        return '#EF4444'; // Red - poor
    };

    const getDepartmentCenter = (dept: PlacedDepartment) => ({
        x: (dept.x + dept.width / 2) * GRID_CELL_SIZE,
        y: (dept.y + dept.height / 2) * GRID_CELL_SIZE,
    });

    return (
        <svg
            className={`absolute inset-0 pointer-events-none z-20 ${className}`}
            style={{ overflow: 'visible' }}
        >
            <defs>
                {/* Arrow markers for different efficiency levels */}
                <marker
                    id="arrow-good"
                    markerWidth="10"
                    markerHeight="10"
                    refX="9"
                    refY="3"
                    orient="auto"
                    markerUnits="strokeWidth"
                >
                    <path d="M0,0 L0,6 L9,3 z" fill="#10B981" />
                </marker>
                <marker
                    id="arrow-okay"
                    markerWidth="10"
                    markerHeight="10"
                    refX="9"
                    refY="3"
                    orient="auto"
                    markerUnits="strokeWidth"
                >
                    <path d="M0,0 L0,6 L9,3 z" fill="#F59E0B" />
                </marker>
                <marker
                    id="arrow-poor"
                    markerWidth="10"
                    markerHeight="10"
                    refX="9"
                    refY="3"
                    orient="auto"
                    markerUnits="strokeWidth"
                >
                    <path d="M0,0 L0,6 L9,3 z" fill="#EF4444" />
                </marker>
            </defs>

            {connections.map((connection, index) => {
                const fromDept = floorDepartments.find(d => d.id === connection.fromDepartmentId);
                const toDept = floorDepartments.find(d => d.id === connection.toDepartmentId);

                if (!fromDept || !toDept) return null;

                const from = getDepartmentCenter(fromDept);
                const to = getDepartmentCenter(toDept);

                // Calculate control points for curved line
                const midX = (from.x + to.x) / 2;
                const midY = (from.y + to.y) / 2;
                const dx = to.x - from.x;
                const dy = to.y - from.y;
                const perpX = -dy * 0.1;
                const perpY = dx * 0.1;

                const controlX = midX + perpX;
                const controlY = midY + perpY;

                const color = getArrowColor(connection.efficiency);
                const markerId = connection.efficiency >= 0.8 ? 'arrow-good' :
                    connection.efficiency >= 0.6 ? 'arrow-okay' : 'arrow-poor';

                return (
                    <g key={index}>
                        {/* Flow line */}
                        <path
                            d={`M ${from.x} ${from.y} Q ${controlX} ${controlY} ${to.x} ${to.y}`}
                            fill="none"
                            stroke={color}
                            strokeWidth="3"
                            strokeDasharray="8 4"
                            markerEnd={`url(#${markerId})`}
                            opacity="0.7"
                        />

                        {/* Efficiency label */}
                        <g transform={`translate(${midX + perpX * 2}, ${midY + perpY * 2})`}>
                            <rect
                                x="-18"
                                y="-10"
                                width="36"
                                height="20"
                                rx="10"
                                fill="white"
                                stroke={color}
                                strokeWidth="2"
                                opacity="0.9"
                            />
                            <text
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize="10"
                                fontWeight="bold"
                                fill={color}
                            >
                                {Math.round(connection.efficiency * 100)}%
                            </text>
                        </g>
                    </g>
                );
            })}
        </svg>
    );
}
