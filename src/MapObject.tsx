"use client";

import React, { useState, useRef } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { motion, AnimatePresence } from "framer-motion";

type MapObject = {
    id: number;
    name: string;
    top: number; // %
    left: number; // %
    width: number; // %
    category: string;
};

const mapObjects: MapObject[] = [
    { id: 1, name: "Музей", top: 20, left: 30, width: 5, category: "museum" },
    { id: 2, name: "Парк", top: 50, left: 60, width: 5, category: "park" },
    { id: 3, name: "Ресторан", top: 70, left: 40, width: 5, category: "restaurant" },
    { id: 4, name: "Кафе", top: 35, left: 80, width: 5, category: "restaurant" },
];

export default function MoleMap() {
    const [activeId, setActiveId] = useState<number | null>(null);
    const [hovered, setHovered] = useState<MapObject | null>(null);
    const [filter, setFilter] = useState<string | null>(null);
    const [popupVisible, setPopupVisible] = useState(false);

    const transformRef = useRef<any>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const filteredObjects = filter ? mapObjects.filter((o) => o.category === filter) : mapObjects;

    const handleSelectObject = (obj: MapObject) => {
        setActiveId(obj.id);
        setPopupVisible(true);
        if (!transformRef.current || !contentRef.current) return;

        const zoom = 2;
        const content = contentRef.current;
        const container = content.parentElement;
        if (!container) return;

        const contentWidth = content.offsetWidth;
        const contentHeight = content.offsetHeight;
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        const x = (obj.left / 100) * contentWidth;
        const y = (obj.top / 100) * contentHeight;

        transformRef.current.setTransform(
            containerWidth / 2 - x * zoom,
            containerHeight / 2 - y * zoom,
            zoom,
            300
        );
    };

    return (
        <div className="w-full h-full p-4">
            <div className="flex">
                {/* Фильтры и список */}
                <div className="w-64 flex-shrink-0 space-y-4">
                    <h2 className="text-lg font-semibold">Фильтры</h2>
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => setFilter(null)}
                            className={`px-3 py-2 rounded ${!filter ? "bg-blue-600" : "bg-gray-700"}`}
                        >
                            Все
                        </button>
                        <button
                            onClick={() => setFilter("museum")}
                            className={`px-3 py-2 rounded ${filter === "museum" ? "bg-blue-600" : "bg-gray-700"}`}
                        >
                            Музеи
                        </button>
                        <button
                            onClick={() => setFilter("park")}
                            className={`px-3 py-2 rounded ${filter === "park" ? "bg-blue-600" : "bg-gray-700"}`}
                        >
                            Парки
                        </button>
                        <button
                            onClick={() => setFilter("restaurant")}
                            className={`px-3 py-2 rounded ${filter === "restaurant" ? "bg-blue-600" : "bg-gray-700"}`}
                        >
                            Рестораны
                        </button>
                    </div>

                    <h2 className="text-lg font-semibold mt-6">Список объектов</h2>
                    <ul className="space-y-2 max-h-[50vh] overflow-auto">
                        {filteredObjects.map((obj) => (
                            <li
                                key={obj.id}
                                className="cursor-pointer hover:text-blue-400"
                                onClick={() => handleSelectObject(obj)}
                            >
                                {obj.name}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Карта */}
                <div className="flex-1 relative">
                    <TransformWrapper ref={transformRef} minScale={0.5} maxScale={5} initialScale={1} wheel={{ step: 0.2 }}>
                        {({ zoomIn, zoomOut }) => (
                            <div className="relative">
                                {/* Кнопки управления */}
                                <div className="absolute top-2 left-2 z-10 flex gap-2">
                                    <button
                                        onClick={() => zoomIn()}
                                        className="bg-white/20 hover:bg-white/40 px-2 py-1 rounded"
                                    >
                                        ➕
                                    </button>
                                    <button
                                        onClick={() => zoomOut()}
                                        className="bg-white/20 hover:bg-white/40 px-2 py-1 rounded"
                                    >
                                        ➖
                                    </button>
                                </div>

                                <TransformComponent
                                    wrapperStyle={{ width: "100%", height: "700px" }}
                                    contentStyle={{ width: "1500px", height: "900px", position: "relative" }}
                                >
                                    <div ref={contentRef} className="absolute w-full h-full">
                                        {/* Фон */}
                                        <div className="absolute w-full h-full">
                                            <img
                                                src="https://cdn-sh1.vigbo.com/shops/2544/products/21612175/images/3-a56dea7a69f3883db66f5bc39eed484c.jpg"
                                                alt="map"
                                                className="w-full h-full object-cover rounded-xl"
                                            />
                                        </div>

                                        {/* Объекты */}
                                        {mapObjects.map((obj) => {
                                            const isVisible = !filter || obj.category === filter;
                                            const isActive = obj.id === activeId;

                                            return (
                                                <div
                                                    key={obj.id}
                                                    onMouseEnter={() => setHovered(obj)}
                                                    onMouseLeave={() => setHovered(null)}
                                                    onClick={() => handleSelectObject(obj)}
                                                    className="absolute rounded-full transition-all duration-500 cursor-pointer"
                                                    style={{
                                                        top: `${obj.top}%`,
                                                        left: `${obj.left}%`,
                                                        width: `${obj.width}%`,
                                                        height: `${obj.width}%`,
                                                        backgroundColor: isVisible ? "#3b82f6" : "#555",
                                                        opacity: isVisible ? 1 : 0.4,
                                                        transform: "translate(-50%, -50%)",
                                                        zIndex: 10,
                                                        animation: isActive ? "pulse 2s infinite" : undefined,
                                                    }}
                                                />
                                            );
                                        })}

                                        {/* Popup */}
                                        <AnimatePresence>
                                            {hovered && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="absolute px-3 py-2 bg-black/80 text-sm rounded shadow-lg pointer-events-none z-20"
                                                    style={{
                                                        left: `${hovered.left}%`,
                                                        top: `${hovered.top}%`,
                                                        transform: "translate(110%, -50%)",
                                                    }}
                                                >
                                                    {hovered.name}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </TransformComponent>
                            </div>
                        )}
                    </TransformWrapper>
                </div>
            </div>

            <style>{`
                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5); }
                    70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
                }
            `}</style>
        </div>
    );
}
