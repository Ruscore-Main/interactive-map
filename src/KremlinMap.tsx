import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState, type JSX } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import KulSharif from "./assets/kul-sharif.svg?react";
import Wall from "./assets/wall.svg?react";

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
    top: 175,
    left: 599,
    width: 101,
    category: "museum",
    src: "map-objects/kul-sharif.webp",
  },
  {
    id: 2,
    name: "Нижняя стена",
    top: 456,
    left: 394,
    width: 279,
    category: "wall",
    src: "map-objects/wall.png",
  },
];

export const KremlinMap = () => {
  const [activeId, setActiveId] = useState<number | null>(null);
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
    const contentWidth = content.offsetWidth;
    const contentHeight = content.offsetHeight;

    const x = obj.left;
    const y = obj.top;

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
      <TransformWrapper ref={transformRef} maxScale={3} minScale={0.9}>
        {({ zoomIn, zoomOut, resetTransform }) => (
          <div className="relative mx-auto" ref={contentRef}>
            <div className="flex flex-col flex-wrap gap-[4px] absolute top-[32px] right-[32px] z-[2]">
              <button onClick={() => zoomIn()}>+</button>
              <button onClick={() => zoomOut()}>-</button>
              <button onClick={() => resetTransform()}>x</button>
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
                        top: `${obj.top}px`,
                        left: `${obj.left}px`,
                        transform: "translate(-50%, -50%)",
                        width: `${obj.width}px`,
                        zIndex: 10,
                        opacity: isVisible ? 1 : 0,
                        pointerEvents: isVisible ? "auto" : "none",
                        cursor: isVisible ? "pointer" : "default",
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
                                top: "-40px",
                                fontSize: "clamp(6px, 16px)",
                              }}
                            >
                              <span className="px-1 py-1 bg-black/80 rounded shadow-lg ">
                                {hovered.name}
                              </span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <img
                          onClick={() => handleSelectObject(obj)}
                          src={obj.src}
                          className="object-contain duration-500 cursor-pointer"
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
    </>
  );
};
