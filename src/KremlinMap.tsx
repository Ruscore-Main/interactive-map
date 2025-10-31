import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
// import KulSharif from "./assets/kul-sharif.svg?react";
// import Wall from "./assets/wall.svg?react";

type MapObject = {
  id: number;
  name: string;
  top: number; // %
  left: number; // %
  width: number; // %
  category: string;
  src?: string;
};

const mapObjects: MapObject[] = [
  {
    id: 1,
    name: "Кул Шариф",
    top: 22.3,
    left: 49.255,
    width: 8.35,
    category: "museum",
    src: "map-objects/kul-sharif.webp",
  },
  {
    id: 2,
    name: "Нижняя стена",
    top: 58.1,
    left: 32.6,
    width: 22.6,
    category: "wall",
    src: "map-objects/bottom-wall.webp",
  },
  {
    id: 3,
    name: "Вход",
    top: 45.7,
    left: 86.6,
    width: 5.1,
    category: "entrance",
    src: "map-objects/entrance.webp",
  },
  {
    id: 4,
    name: "Церковь 1",
    top: 53.26,
    left: 62.43,
    width: 7.2,
    category: "church",
    src: "map-objects/church-1.webp",
  },
  {
    id: 5,
    name: "Церковь 2",
    top: 54.9,
    left: 77.66,
    width: 4.3,
    category: "church",
    src: "map-objects/church-2.webp",
  },
  {
    id: 6,
    name: "Музей 1",
    top: 37,
    left: 34,
    width: 4.1,
    category: "museum",
    src: "map-objects/museum-1.webp",
  },
  {
    id: 7,
    name: "Выход",
    top: 39.24,
    left: 11.11,
    width: 5.73,
    category: "entrance",
    src: "map-objects/exit.webp",
  },
];

export const KremlinMap = () => {
  const [__, setActiveId] = useState<number | null>(null);
  const [hovered, setHovered] = useState<MapObject | null>(null);
  const [filter, setFilter] = useState<string | null>(null);
  const [_, setPopupVisible] = useState(false);

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
    <div className="max-w-[1500px] mx-auto">
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
              Входы/выходы
            </button>
            <button
              onClick={() => setFilter("wall")}
              className={`px-3 py-2 rounded ${
                filter === "wall" ? "bg-blue-600" : "bg-gray-700"
              }`}
            >
              Стены
            </button>
            <button
              onClick={() => setFilter("church")}
              className={`px-3 py-2 rounded ${
                filter === "church" ? "bg-blue-600" : "bg-gray-700"
              }`}
            >
              Церкви
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
      <TransformWrapper ref={transformRef} maxScale={3} minScale={0.9}>
        {({ zoomIn, zoomOut, resetTransform }) => (
          <div className="relative mx-auto" ref={contentRef}>
            <div className="flex flex-col gap-[4px] absolute right-[32px] top-[32px] z-[2]">
              <button onClick={() => zoomIn()}>
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="48" height="48" rx="24" fill="white" />
                  <path d="M33 24L15 24" stroke="#404041" />
                  <path d="M24 33V15" stroke="#404041" />
                </svg>
              </button>
              <button onClick={() => zoomOut()}>
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="48" height="48" rx="24" fill="white" />
                  <path d="M33 24L15 24" stroke="#404041" />
                </svg>
              </button>
              <button
                onClick={() => resetTransform()}
                className="p-3 bg-[#E32F26] rounded-full"
              >
                X
              </button>
            </div>
            <TransformComponent
              contentStyle={{
                width: "initial",
                height: "100%",
              }}
              wrapperStyle={{
                width: "initial",
                height: "100%",
                transform: "translate3d(0,0,0)",
              }}
            >
              <div className="relative overflow-hidden h-full w-full outline-0">
                <img
                  src="kremlin-map-image25x.webp"
                  alt="map"
                  className="w-full"
                />

                {mapObjects.map((obj) => {
                  const isVisible = filter === null || obj.category === filter;

                  return (
                    <div
                      key={obj.id}
                      className="absolute"
                      style={{
                        top: `${obj.top}%`,
                        left: `${obj.left}%`,
                        transform: "translate(-50%, -50%)",
                        width: `${obj.width}%`,
                        zIndex: 10,
                        opacity: isVisible ? 1 : 0,
                        pointerEvents: isVisible ? "auto" : "none",
                        cursor: isVisible ? "pointer" : "default",
                        transition: "opacity 0.3s ease-in-out",
                      }}
                      onMouseEnter={() => setHovered(obj)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      <div className="relative">
                        <AnimatePresence>
                          {hovered && hovered.id === obj.id && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              transition={{ duration: 0.2 }}
                              className="absolute flex w-full justify-center pointer-events-none z-20 "
                              style={{
                                top: "-30px",
                                fontSize: "80%",
                              }}
                            >
                              <span className="px-1 py-1 bg-white/80 rounded shadow-lg ">
                                {hovered.name}
                              </span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <img
                          onClick={() => handleSelectObject(obj)}
                          src={obj.src}
                          className="object-contain cursor-pointer"
                        />
                      </div>
                    </div>
                  );
                })}
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
    </div>
  );
};
