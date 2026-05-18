import { liquidMetalFragmentShader, ShaderMount } from "@paper-design/shaders";
import { Sparkles } from "lucide-react";
import PropTypes from "prop-types";
import { useEffect, useMemo, useRef, useState } from "react";

export function LiquidMetalButton({
  label = "Get Started",
  onClick,
  viewMode = "text",
  fullWidth = false,
  className = "",
  labelColor = "#666666",
  badge = false
}) {
  const isBadge = badge === true;
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState([]);
  const shaderRef = useRef(null);
  // biome-ignore lint/suspicious/noExplicitAny: External library without types
  const shaderMount = useRef(null);
  const buttonRef = useRef(null);
  const rippleId = useRef(0);

  const dimensions = useMemo(() => {
    if (viewMode === "icon") {
      return {
        width: 46,
        height: 46,
        innerWidth: 42,
        innerHeight: 42,
        shaderWidth: 46,
        shaderHeight: 46,
      };
    } else if (isBadge) {
      return {
        width: 58,
        height: 24,
        innerWidth: 54,
        innerHeight: 20,
        shaderWidth: 58,
        shaderHeight: 24,
      };
    } else {
      return {
        width: fullWidth ? "100%" : 142,
        height: 46,
        innerWidth: fullWidth ? "calc(100% - 4px)" : 138,
        innerHeight: 42,
        shaderWidth: fullWidth ? "100%" : 142,
        shaderHeight: 46,
      };
    }
  }, [viewMode, fullWidth, isBadge]);

  const w = typeof dimensions.width === 'number' ? `${dimensions.width}px` : dimensions.width;
  const h = typeof dimensions.height === 'number' ? `${dimensions.height}px` : dimensions.height;
  const iw = typeof dimensions.innerWidth === 'number' ? `${dimensions.innerWidth}px` : dimensions.innerWidth;
  const ih = typeof dimensions.innerHeight === 'number' ? `${dimensions.innerHeight}px` : dimensions.innerHeight;
  const sw = typeof dimensions.shaderWidth === 'number' ? `${dimensions.shaderWidth}px` : dimensions.shaderWidth;
  const sh = typeof dimensions.shaderHeight === 'number' ? `${dimensions.shaderHeight}px` : dimensions.shaderHeight;

  useEffect(() => {
    const styleId = "shader-canvas-style-exploded";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .shader-container-exploded canvas {
          width: 100% !important;
          height: 100% !important;
          display: block !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          border-radius: 100px !important;
        }
        @keyframes ripple-animation {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0.6;
          }
          100% {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    const loadShader = async () => {
      try {
        // static import used above

        if (shaderRef.current) {
          if (shaderMount.current?.destroy) {
            shaderMount.current.destroy();
          }

          shaderMount.current = new ShaderMount(shaderRef.current, liquidMetalFragmentShader, {
            u_repetition: 4,
            u_softness: 0.5,
            u_shiftRed: 0.3,
            u_shiftBlue: 0.3,
            u_distortion: 0,
            u_contour: 0,
            u_angle: 45,
            u_scale: 8,
            u_shape: 1,
            u_offsetX: 0.1,
            u_offsetY: -0.1,
          }, undefined, 0.6);
        }
      } catch (error) {
        console.error("[v0] Failed to load shader:", error);
      }
    };

    loadShader();

    return () => {
      if (shaderMount.current?.destroy) {
        shaderMount.current.destroy();
        shaderMount.current = null;
      }
    };
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    shaderMount.current?.setSpeed?.(1);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
    shaderMount.current?.setSpeed?.(0.6);
  };

  const handleClick = (e) => {
    if (shaderMount.current?.setSpeed) {
      shaderMount.current.setSpeed(2.4);
      setTimeout(() => {
        if (isHovered) {
          shaderMount.current?.setSpeed?.(1);
        } else {
          shaderMount.current?.setSpeed?.(0.6);
        }
      }, 300);
    }

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const ripple = { x, y, id: rippleId.current++ };

      setRipples((prev) => [...prev, ripple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
      }, 600);
    }

    onClick?.();
  };

  return (
    <div className={`relative inline-block ${fullWidth ? 'w-full' : ''} ${isBadge ? 'pointer-events-none' : ''} ${className}`}>
      <div
        style={{
          perspective: "1000px",
          perspectiveOrigin: "50% 50%",
        }}>
        <div
          style={{
            position: "relative",
            width: w,
            height: h,
            transformStyle: "preserve-3d",
            transition:
              "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease",
            transform: "none",
          }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: w,
              height: h,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              transformStyle: "preserve-3d",
              transition:
                "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease, gap 0.4s ease",
              transform: "translateZ(20px)",
              zIndex: 30,
              pointerEvents: "none",
            }}>
            {viewMode === "icon" && (
              <Sparkles
                size={16}
                style={{
                  color: "#666666",
                  filter: "drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.5))",
                  transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  transform: "scale(1)",
                }} />
            )}
            {viewMode === "text" && (
              <span
                style={{
                  fontSize: isBadge ? "9px" : "14px",
                  color: labelColor,
                  fontWeight: isBadge ? 700 : 400,
                  letterSpacing: isBadge ? "0.18em" : "normal",
                  textTransform: isBadge ? "uppercase" : "none",
                  textShadow: isBadge ? "none" : "0px 1px 2px rgba(0, 0, 0, 0.5)",
                  transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  transform: "scale(1)",
                  whiteSpace: "nowrap",
                }}>
                {label}
              </span>
            )}
          </div>

          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: w,
              height: h,
              transformStyle: "preserve-3d",
              transition:
                "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease",
              transform: `translateZ(10px) ${isPressed ? "translateY(1px) scale(0.98)" : "translateY(0) scale(1)"}`,
              zIndex: 20,
            }}>
            <div
              style={{
                width: iw,
                height: ih,
                margin: "2px",
                borderRadius: "100px",
                background: "linear-gradient(180deg, #202020 0%, #000000 100%)",
                boxShadow: isPressed
                  ? "inset 0px 2px 4px rgba(0, 0, 0, 0.4), inset 0px 1px 2px rgba(0, 0, 0, 0.3)"
                  : "none",
                transition:
                  "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease, box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
              }} />
          </div>

          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: w,
              height: h,
              transformStyle: "preserve-3d",
              transition:
                "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease",
              transform: `translateZ(0px) ${isPressed ? "translateY(1px) scale(0.98)" : "translateY(0) scale(1)"}`,
              zIndex: 10,
            }}>
            <div
              style={{
                height: h,
                width: w,
                borderRadius: "100px",
                boxShadow: isPressed
                  ? "0px 0px 0px 1px rgba(0, 0, 0, 0.5), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)"
                  : isHovered
                    ? "0px 0px 0px 1px rgba(0, 0, 0, 0.4), 0px 12px 6px 0px rgba(0, 0, 0, 0.05), 0px 8px 5px 0px rgba(0, 0, 0, 0.1), 0px 4px 4px 0px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.2)"
                    : "0px 0px 0px 1px rgba(0, 0, 0, 0.3), 0px 36px 14px 0px rgba(0, 0, 0, 0.02), 0px 20px 12px 0px rgba(0, 0, 0, 0.08), 0px 9px 9px 0px rgba(0, 0, 0, 0.12), 0px 2px 5px 0px rgba(0, 0, 0, 0.15)",
                transition:
                  "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease, box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
                background: "rgb(0 0 0 / 0)",
              }}>
              <div
                ref={shaderRef}
                className="shader-container-exploded"
                style={{
                  borderRadius: "100px",
                  overflow: "hidden",
                  position: "relative",
                  width: sw,
                  maxWidth: sw,
                  height: sh,
                  transition: "width 0.4s ease, height 0.4s ease",
                }} />
            </div>
          </div>

          {isBadge ? (
            <div
              ref={buttonRef}
              aria-hidden="true"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: w,
                height: h,
                background: "transparent",
                border: "none",
                outline: "none",
                zIndex: 40,
                transformStyle: "preserve-3d",
                transform: "translateZ(25px)",
                transition:
                  "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease",
                overflow: "hidden",
                borderRadius: "100px",
              }}
            />
          ) : (
            <button
              ref={buttonRef}
              onClick={handleClick}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseDown={() => setIsPressed(true)}
              onMouseUp={() => setIsPressed(false)}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: w,
                height: h,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                outline: "none",
                zIndex: 40,
                transformStyle: "preserve-3d",
                transform: "translateZ(25px)",
                transition:
                  "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease",
                overflow: "hidden",
                borderRadius: "100px",
              }}
              aria-label={label}>
              {ripples.map((ripple) => (
                <span
                  key={ripple.id}
                  style={{
                    position: "absolute",
                    left: `${ripple.x}px`,
                    top: `${ripple.y}px`,
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 70%)",
                    pointerEvents: "none",
                    animation: "ripple-animation 0.6s ease-out",
                  }} />
              ))}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

LiquidMetalButton.propTypes = {
  label: PropTypes.node,
  onClick: PropTypes.func,
  viewMode: PropTypes.oneOf(["text", "icon"]),
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  labelColor: PropTypes.string,
  badge: PropTypes.bool,
};
