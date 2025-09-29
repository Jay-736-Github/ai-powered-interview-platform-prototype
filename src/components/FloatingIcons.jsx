import React, { useEffect, useRef } from "react";
import { Box, useTheme } from "@mui/material";
import {
  FaNodeJs,
  FaReact,
  FaJava,
  FaPython,
  FaDocker,
  FaAws,
  FaGitAlt,
  FaHtml5,
  FaCss3Alt,
  FaAngular,
} from "react-icons/fa";
import {
  SiTypescript,
  SiGo,
  SiRust,
  SiPostgresql,
  SiMysql,
  SiMongodb,
  SiRedis,
  SiKubernetes,
  SiGooglecloud,
} from "react-icons/si";
import { DiDjango } from "react-icons/di";

const icons = [
  { icon: FaReact, color: "#61DAFB" },
  { icon: FaNodeJs, color: "#68A063" },
  { icon: SiTypescript, color: "#3178C6" },
  { icon: FaPython, color: "#3776AB" },
  { icon: FaJava, color: "#007396" },
  { icon: FaDocker, color: "#2496ED" },
  { icon: SiPostgresql, color: "#336791" },
  { icon: SiMongodb, color: "#47A248" },
  { icon: FaAws, color: "#232F3E" },
  { icon: SiKubernetes, color: "#326CE5" },
  { icon: FaGitAlt, color: "#F05032" },
  { icon: SiGo, color: "#00ADD8" },
  { icon: SiRust, color: "#000000" },
  { icon: SiRedis, color: "#DC382D" },
  { icon: SiGooglecloud, color: "#4285F4" },
  { icon: FaHtml5, color: "#E34F26" },
  { icon: FaCss3Alt, color: "#1572B6" },
  { icon: FaAngular, color: "#DD0031" },
  { icon: DiDjango, color: "#092E20" },
  { icon: SiMysql, color: "#4479A1" },
];

const ICON_SIZE_PX = 100;
const NAVBAR_HEIGHT = 64;

export default function FloatingIcons() {
  const theme = useTheme();
  const iconRefs = useRef([]);
  const physicsRef = useRef([]);
  const animationFrameId = useRef();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;

    const container = document.getElementById("floating-icon-container");
    if (!container) return;

    const { width, height } = container.getBoundingClientRect();
    const newPhysics = [];

    for (let i = 0; i < icons.length; i++) {
      let position;
      let overlaps;
      let attempts = 0;

      do {
        overlaps = false;
        position = {
          x: Math.random() * (width - ICON_SIZE_PX),
          y: Math.random() * (height - ICON_SIZE_PX),
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
        };

        for (let j = 0; j < newPhysics.length; j++) {
          const other = newPhysics[j];
          const distance = Math.hypot(
            position.x - other.x,
            position.y - other.y
          );
          if (distance < ICON_SIZE_PX) {
            overlaps = true;
            break;
          }
        }
        attempts++;
      } while (overlaps && attempts < 100);

      newPhysics.push(position);
    }

    physicsRef.current = newPhysics;
    hasInitialized.current = true;
  }, []);

  useEffect(() => {
    const animate = () => {
      const physics = physicsRef.current;
      const container = document.getElementById("floating-icon-container");
      if (!container || physics.length === 0) {
        animationFrameId.current = requestAnimationFrame(animate);
        return;
      }
      const { width, height } = container.getBoundingClientRect();
      for (let i = 0; i < physics.length; i++) {
        const p = physics[i];

        p.x += p.vx;
        p.y += p.vy;

        if (p.x <= 0 || p.x >= width - ICON_SIZE_PX) p.vx *= -1;
        if (p.y <= 0 || p.y >= height - ICON_SIZE_PX) p.vy *= -1;

        for (let j = i + 1; j < physics.length; j++) {
          const other = physics[j];
          const distance = Math.hypot(p.x - other.x, p.y - other.y);
          if (distance < ICON_SIZE_PX) {
            const tempVx = p.vx;
            const tempVy = p.vy;
            p.vx = other.vx;
            p.vy = other.vy;
            other.vx = tempVx;
            other.vy = tempVy;
          }
        }
      }

      iconRefs.current.forEach((ref, index) => {
        if (ref) {
          ref.style.transform = `translate(${physics[index].x}px, ${physics[index].y}px)`;
        }
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };
    animationFrameId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId.current);
  }, []);

  return (
    <Box
      id="floating-icon-container"
      sx={{
        position: "absolute",
        top: `${NAVBAR_HEIGHT}px`,
        left: 0,
        width: "100%",
        height: `calc(100% - ${NAVBAR_HEIGHT}px)`,
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      {icons.map((item, index) => (
        <Box
          key={index}
          ref={(el) => (iconRefs.current[index] = el)}
          style={{
            position: "absolute",
            width: ICON_SIZE_PX,
            height: ICON_SIZE_PX,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: ICON_SIZE_PX * 0.6,
            color: item.color,
            opacity: theme.palette.mode === "dark" ? 0.3 : 0.2,
          }}
        >
          {React.createElement(item.icon)}
        </Box>
      ))}
    </Box>
  );
}
