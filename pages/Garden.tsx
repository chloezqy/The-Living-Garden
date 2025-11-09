import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type p5 from "p5";

import { socket } from "../socket";
import { WorldState, Spirit, ActivityState } from "../types";
import { ActivityMonitor } from "../lib/activityMonitor";
import { renderPlant } from "../render/renderObject";

const BACKGROUND_PATH = "/background.png";

const P5Sketch: React.FC<{ world: WorldState }> = ({ world }) => {
  const sketchRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<p5 | null>(null);
  const spiritsRef = useRef<{ [id: string]: Spirit }>({});
  const bgImgRef = useRef<p5.Image | null>(null);
  const localPositions = useRef<Record<string, { x: number; y: number }>>({});

  useEffect(() => {
    spiritsRef.current = world.spirits;
  }, [world]);

  useEffect(() => {
    const Sketch = (p: p5) => {
      p.preload = () => {
        bgImgRef.current = p.loadImage(BACKGROUND_PATH);
      };

      p.setup = () => {
        if (sketchRef.current) {
          p.createCanvas(
            sketchRef.current.offsetWidth,
            sketchRef.current.offsetHeight
          ).parent(sketchRef.current);
          p.imageMode(p.CENTER);
          p.pixelDensity(2);
          p.smooth();
        }
      };

      p.draw = () => {
        const currentSpirits: Spirit[] = Object.values(spiritsRef.current);

        // 背景图覆盖整个画布
        if (bgImgRef.current) {
          p.imageMode(p.CORNER);
          p.image(bgImgRef.current, 0, 0, p.width, p.height);
        } else {
          p.background(20, 30, 40);
        }

        for (const spirit of currentSpirits) {
          // 只在第一次分配固定位置
          if (!localPositions.current[spirit.id]) {
            const x = p.random(p.width * 0.3, p.width * 0.7);
            // 云应该出现在天空中，y 偏高（靠近画布顶部）。其余 archetype 保持原来的范围。
            const y =
              spirit.archetype === "cloud"
                ? p.random(p.height * 0.08, p.height * 0.28)
                : p.random(p.height * 0.5, p.height * 0.8);

            localPositions.current[spirit.id] = { x, y };
          }

          // 使用本地固定坐标
          const { x, y } = localPositions.current[spirit.id];
          spirit.x = x;
          spirit.y = y;
          spirit.size = 40;

          switch (spirit.archetype) {
            case "animal":
              renderPlant(p, spirit);
              break;
            case "cloud":
              renderPlant(p, spirit);
              break;
            case "plant":
              renderPlant(p, spirit);
              break;
          }
        }
      };

      p.windowResized = () => {
        if (sketchRef.current) {
          p.resizeCanvas(
            sketchRef.current.offsetWidth,
            sketchRef.current.offsetHeight
          );
        }
      };
    };

    import("p5").then((p5Module) => {
      if (sketchRef.current && !p5InstanceRef.current) {
        p5InstanceRef.current = new p5Module.default(Sketch);
      }
    });

    return () => {
      p5InstanceRef.current?.remove();
      p5InstanceRef.current = null;
    };
  }, []);

  return (
    <div
      ref={sketchRef}
      className="absolute top-0 left-0 w-full h-full -z-10"
    />
  );
};

const Garden: React.FC = () => {
  const [worldState, setWorldState] = useState<WorldState>({ spirits: {} });
  const [spiritId, setSpiritId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleReborn = () => {
    localStorage.removeItem("spiritProfile");
    localStorage.removeItem("spiritId");
    socket.disconnect();
    navigate("/quiz");
  };

  const onStateChange = useCallback(
    (newState: ActivityState) => {
      if (spiritId) {
        socket.emit("spirit:state", { id: spiritId, activityState: newState });
      }
    },
    [spiritId]
  );

  useEffect(() => {
    const profile = localStorage.getItem("spiritProfile");
    if (!profile) {
      navigate("/quiz");
      return;
    }

    const base = JSON.parse(profile) as Omit<Spirit, "id" | "activityState">;
    const id =
      localStorage.getItem("spiritId") ?? `spirit_${crypto.randomUUID()}`;
    localStorage.setItem("spiritId", id);

    const spirit: Spirit = {
      id,
      activityState: "active",
      ...base,
    };

    setSpiritId(spirit.id);
    socket.connect();

    const onWorldUpdate = (newWorldState: WorldState) =>
      setWorldState(newWorldState);
    socket.on("world:update", onWorldUpdate);

    socket.emit("spirit:upsert", spirit);

    const activityMonitor = new ActivityMonitor(onStateChange);
    activityMonitor.start();

    return () => {
      socket.off("world:update", onWorldUpdate);
      socket.disconnect();
      activityMonitor.stop();
    };
  }, [navigate, onStateChange]);

  const spiritCount = Object.keys(worldState.spirits).length;

  return (
    <div className="relative w-screen h-screen overflow-hidden font-serif">
      <P5Sketch world={worldState} />
      <div className="absolute top-0 left-0 p-4 md:p-6 text-white mix-blend-difference">
        <h1 className="text-2xl md:text-3xl font-bold">The Living Garden</h1>
        <p className="text-md md:text-lg">
          {spiritCount}{" "}
          {spiritCount === 1 ? "spirit" : "spirits"} currently present.
        </p>
      </div>
      <div className="absolute bottom-0 right-0 p-4 md:p-6">
        <button
          onClick={handleReborn}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-600 text-slate-200 px-5 py-2 rounded-lg text-md hover:bg-teal-800/70 hover:border-teal-500 transition-all duration-300"
        >
          Reborn
        </button>
      </div>
    </div>
  );
};

export default Garden;