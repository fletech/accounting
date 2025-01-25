// import { motion, useMotionValue, useTransform } from "framer-motion";
// import { X } from "lucide-react";
// import { useState, useEffect } from "react";

// export default function DetailDrawer({ children, onClose, title }) {
//   const [height, setHeight] = useState("75vh");
//   const pullProgress = useMotionValue(0);
//   const opacity = useTransform(pullProgress, [0, 100], [1, 0]);

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === "Escape") {
//         onClose();
//       }
//       if ((e.metaKey || e.ctrlKey) && e.key === "ArrowUp") {
//         setHeight("90vh");
//       }
//       if ((e.metaKey || e.ctrlKey) && e.key === "ArrowDown") {
//         setHeight("75vh");
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [onClose]);

//   const handlePull = (_, info) => {
//     const pull = Math.min(0, info.offset.y);
//     const newHeight = Math.min(100, 85 - pull / 5);
//     setHeight(`${newHeight}vh`);
//     pullProgress.set(Math.abs(pull));
//   };

//   return (
//     <>
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         className="fixed inset-0 bg-black bg-opacity-50 z-40"
//         onClick={onClose}
//         style={{ opacity }}
//       />
//       <motion.div
//         drag="y"
//         dragConstraints={{ top: 0, bottom: 0 }}
//         dragElastic={0.1}
//         onDrag={handlePull}
//         initial={{ y: "100%" }}
//         animate={{ y: 0 }}
//         exit={{ y: "100%" }}
//         transition={{ type: "spring", damping: 30, stiffness: 300 }}
//         style={{ height }}
//         className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl z-50 overflow-y-auto transform-gpu"
//       >
//         <div className="sticky top-0 bg-white border-b border-gray-200">
//           <div className="mx-auto w-12 h-1.5 bg-gray-300 rounded-full my-3 cursor-row-resize" />
//           <div className="px-6 pb-4 flex justify-between items-center">
//             <h2 className="text-lg font-semibold">{title}</h2>
//             <div className="flex items-center gap-2">
//               <span className="text-xs text-gray-500">ESC para cerrar</span>
//               <button
//                 onClick={onClose}
//                 className="p-1 hover:bg-gray-100 rounded"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         </div>
//         <div className="p-6">{children}</div>
//       </motion.div>
//     </>
//   );
// }

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

const MIN_HEIGHT = 75;
const MAX_HEIGHT = 90;

export default function DetailDrawer({ children, onClose, title }) {
  const [height, setHeight] = useState(`${MIN_HEIGHT}vh`);
  const y = useMotionValue(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === "ArrowUp") {
        setHeight(`${MAX_HEIGHT}vh`);
        animate(y, 0);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "ArrowDown") {
        setHeight(`${MIN_HEIGHT}vh`);
        animate(y, 0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handlePull = (_, info) => {
    if (height === `${MAX_HEIGHT}vh` && info.offset.y < 0) {
      y.set(0);
      return;
    }

    const pull = Math.min(0, info.offset.y);
    const newHeight = Math.min(MAX_HEIGHT, MIN_HEIGHT - pull / 5);
    setHeight(`${newHeight}vh`);
    y.set(info.offset.y);
  };

  const handleDragEnd = (_, info) => {
    if (info.offset.y > 50 || info.velocity.y > 500) {
      onClose();
    } else {
      animate(y, 0);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.1}
        onDrag={handlePull}
        onDragEnd={handleDragEnd}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        style={{ height, y }}
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl z-50 overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200">
          <div className="mx-auto w-12 h-1.5 bg-gray-300 rounded-full my-3 cursor-row-resize" />
          <div className="px-6 pb-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold">{title}</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">ESC para cerrar</span>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </>
  );
}
