import React, { useRef, useEffect, useState, useContext, memo } from "react";
import { getPlayerData } from "../../services/firebaseDatabase";
import { MiscContext } from "../../contexts/miscContext";
import { motion } from "framer-motion";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

const paletaDestaque = [
  "F0A060", // Laranja Suave/Pêssego
  "6EC1E4", // Azul Céu/Azul Claro
  "B3D9DA", // Verde Água Claro
  "A0522D", // Sienna (Marrom Terroso Claro)
  "4682B4", // Azul Aço
];

function CardComponent({ name, ranks, sx, label, onLoad, clickable = true }) {
  const canvasRef = useRef(null);
  const imageRef = useRef(null); // Cache the background image
  const [photoSrc, setPhotoSrc] = useState("");
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const { cardBackground, getCardbackground } = useContext(MiscContext);
  const navigate = useNavigate();

  // notionists-neutral
  // croodles-neutral
  // thumbs
  // shapes
  // icons
  // initials
  // bottts-neutral
  // pixel-art-neutral
  // lorelei-neutral
  // notionists

  useEffect(() => {
    if (!cardBackground) {
      getCardbackground();
    }
    (async () => {
      getPlayerData(name)
        .then((r2) => {
          setPhotoSrc(
            r2
              ? r2.photo
              : `https://api.dicebear.com/9.x/croodles-neutral/svg?seed=${name}&backgroundColor=${paletaDestaque.join(
                  ","
                )}&scale=70`
          );
        })
        .catch(() => {
          setPhotoSrc(
            `https://api.dicebear.com/9.x/croodles-neutral/svg?seed=${name}&backgroundColor=${paletaDestaque.join(
              ","
            )}`
          );
        })
        .finally(() => {
          setTimeout(() => setLoading(false), 500);
        });
    })();
  }, [name, cardBackground, getCardbackground]);

  useEffect(() => {
    if (loading) {
      return;
    }
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Cache the background image to avoid re-fetching
    if (!imageRef.current || imageRef.current.src !== cardBackground) {
      imageRef.current = new Image();
      imageRef.current.src = cardBackground;
    }
    const image = imageRef.current;

    const photo = new Image();
    photo.src = photoSrc;

    let imageLoaded = image.complete; // Check if already loaded
    let photoLoaded = false;

    const drawCanvas = () => {
      if (imageLoaded && photoLoaded) {
        onLoad && onLoad();
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(photo, 40, 60, 250, 180); // Added width and height for consistent sizing
        context.drawImage(image, 0, 0);
        context.font = "bold italic 25px Helvetica";
        context.fillStyle = "#f0ffff";

        // area de texto do nome é de ~360 x 60
        // tamanho ideal de foto é de ~250 x 180

        let startString = (350 - context.measureText(label).width) / 2;

        context.fillText(label, startString, 50);

        context.font = "bold italic 23px Courier New";
        context.fillStyle = "black";
        context.fillText(ranks.top, 255, 267);
        context.fillText(ranks.jungle, 255, 295);
        context.fillText(ranks.mid, 255, 323);
        context.fillText(ranks.adc, 255, 351);
        context.fillText(ranks.support, 255, 379);
        setLoading2(false);
      }
    };

    // If image is already loaded, proceed immediately
    if (imageLoaded) {
      // Image is already loaded, just need to wait for photo
    } else {
      image.onload = () => {
        imageLoaded = true;
        drawCanvas();
      };
    }

    photo.onload = () => {
      photoLoaded = true;
      drawCanvas();
    };

    photo.onerror = () => {
      // If the photo fails to load, still draw the canvas without the photo
      photoLoaded = true;
      drawCanvas();
    };

    // Set crossOrigin before setting src for external URLs
    photo.crossOrigin = "anonymous";

    // If image is already complete and photo loads immediately, draw now
    if (imageLoaded && photo.complete) {
      photoLoaded = true;
      drawCanvas();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [label, photoSrc, ranks, cardBackground, loading]);

  if (loading) {
    return (
      <div style={{ ...sx, display: "flex" }}>
        <div style={{ margin: "auto" }}>
          <CircularProgress />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="player-card"
      onDoubleClick={() => {
        if (clickable) {
          navigate("/player/" + name);
        }
      }}
      style={{
        height: "100%",
        cursor: "pointer",
        ...sx,
      }}
      initial="initial"
      animate="animate"
      variants={{
        initial: {
          opacity: 0,
        },
        animate: {
          opacity: 1,
          transition: {
            duration: 0.3,
          },
        },
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          border: "1px solid black",
          borderRadius: 10,
          display: loading2 ? "none" : "block",
          ...sx,
        }}
      />
    </motion.div>
  );
}

export default memo(CardComponent);
