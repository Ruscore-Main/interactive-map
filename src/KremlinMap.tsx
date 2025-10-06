import { AnimatePresence, motion } from "framer-motion";
import React, { useRef, useState } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

type MapObject = {
  id: number;
  name: string;
  top: number; // %
  left: number; // %
  width: number; // %
  category: string;
};

const mapObjects: MapObject[] = [
  { id: 1, name: "Музей 1", top: 16.5, left: 30, width: 5, category: "museum" },
  {
    id: 2,
    name: "Музей 2",
    top: 42,
    left: 50,
    width: 5,
    category: "museum",
  },
  {
    id: 3,
    name: "Стена",
    top: 66,
    left: 33,
    width: 4,
    category: "wall",
  },
  { id: 4, name: "Вход", top: 50, left: 88, width: 2, category: "entrance" },
];

export const KremlinMap = () => {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [hovered, setHovered] = useState<MapObject | null>(null);
  const [filter, setFilter] = useState<string | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);

  const transformRef = useRef<any>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const filteredObjects = filter
    ? mapObjects.filter((o) => o.category === filter)
    : mapObjects;

  const handleSelectObject = (obj: MapObject) => {
    setActiveId(obj.id);
    setPopupVisible(true);
    if (!transformRef.current || !contentRef.current) return;

    const zoom = 3;
    const content = contentRef.current;
    if (!content) return;

    const contentWidth = content.offsetWidth;
    const contentHeight = content.offsetHeight;

    const x = (obj.left / 100) * contentWidth;
    const y = (obj.top / 100) * contentHeight;

    transformRef.current.setTransform(
      contentWidth / 2 - x * zoom,
      contentHeight / 2 - y * zoom,
      zoom,
      300
    );
  };

  return (
    <>
      <div className="flex gap-10 mb-10">
        <div className="w-1/4">
          <h2 className="text-lg font-semibold">Фильтры</h2>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setFilter(null)}
              className={`px-3 py-2 rounded ${
                !filter ? "bg-blue-600" : "bg-gray-700"
              }`}
            >
              Все
            </button>
            <button
              onClick={() => setFilter("museum")}
              className={`px-3 py-2 rounded ${
                filter === "museum" ? "bg-blue-600" : "bg-gray-700"
              }`}
            >
              Музеи
            </button>
            <button
              onClick={() => setFilter("entrance")}
              className={`px-3 py-2 rounded ${
                filter === "entrance" ? "bg-blue-600" : "bg-gray-700"
              }`}
            >
              Входы
            </button>
            <button
              onClick={() => setFilter("wall")}
              className={`px-3 py-2 rounded ${
                filter === "wall" ? "bg-blue-600" : "bg-gray-700"
              }`}
            >
              Стены
            </button>
          </div>
        </div>

        <div className="">
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
      </div>
      <TransformWrapper ref={transformRef}>
        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
          <div className="relative mx-auto" ref={contentRef}>
            <div className="flex flex-col flex-wrap gap-[4px] absolute top-[32px] right-[32px] z-[2]">
              <button onClick={() => zoomIn()}>+</button>
              <button onClick={() => zoomOut()}>-</button>
              <button onClick={() => resetTransform()}>x</button>
            </div>
            <TransformComponent>
              <div className="relative overflow-hidden h-full w-full outline-0">
                <img
                  src="/kremlin-map-image.png"
                  alt="map"
                  className="w-full"
                />

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
                        transform: "translate(-50%, -130%)",
                        fontSize: "clamp(10px, 1.2vw, 16px)",
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
      <style>{`
                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5); }
                    70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
                }
            `}</style>
    </>
  );
};
