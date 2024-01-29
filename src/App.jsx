import React, { useState, useCallback, useRef } from "react";

import "./App.css";

const DraggablePoint = ({
  id,
  x = "0px",
  y = "0px",
  onMouseDown = () => {},
}) => {
  const ref = useRef(null);
  const [coordinate, setCoordinate] = useState({ x: x, y: y });

  const handleMouseDown = useCallback((event) => {
    const point = ref.current;
    point.style.position = "absolute";
    point.style.zIndex = 1000;
    const parent = ref.current.parentElement;

    function moveAt(pageX, pageY) {
      point.style.left =
        pageX - parent.offsetLeft - point.offsetWidth / 2 + "px";
      point.style.top =
        pageY - parent.offsetTop - point.offsetHeight / 2 + "px";
      console.log(point.style.left, point.style.top, parent.offsetLeft);
      //console.log(point.style.left, point.style.top);
      //console.log(ref.current.parentElement);
      setCoordinate(() => ({ x: point.style.left, y: point.style.top }));
      onMouseDown(pageX, pageY);
    }

    moveAt(event.pageX, event.pageY);

    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }

    document.addEventListener("mousemove", onMouseMove);

    point.onmouseup = function () {
      document.removeEventListener("mousemove", onMouseMove);
      point.onmouseup = null;
    };
    point.onmousedown = function () {
      document.removeEventListener("mousemove", onMouseMove);
      point.onmouseup = null;
    };
  }, []);

  return (
    <div
      ref={ref}
      id={id}
      className="draggable-point"
      onMouseDown={handleMouseDown}
      style={{
        width: "10px",
        height: "10px",
        backgroundColor: "red",
        left: coordinate.x,
        top: coordinate.y,
        borderRadius: "50%",
        position: "absolute",
        cursor: "pointer",
      }}
    />
  );
};

function App() {
  return (
    <div className="flex flex-col sm:w-full md:w-7/12 lg:min-w-md mx-auto ">
      <div className="bg-white rounded-lg p-4 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold text-gray-700">
            Image Wrapping
          </h1>
        </div>
        <div className="flex flex-wrap -mx-2 mb-4">
          <input
            className="w-32 mx-2 p-2 border rounded-full text-gray-700"
            placeholder="width"
            type="text"
          />
          <input
            className="w-32 mx-2 p-2 border rounded-full text-gray-700"
            placeholder="height"
            type="text"
          />

          <button className="w-full sm:w-auto px-6 py-2 mx-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 focus:outline-none">
            Process
          </button>
        </div>
        <div className="flex flex-wrap -mx-2">
          <div className="w-full md:w-1/2 p-2">
            <div className="inline-block relative">
              {/* Placeholder for image */}
              {/*               <span className="text-purple-500" style={{ zIndex: 1 }}>Image Preview</span>
               */}
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/45/Chatlabai.jpg"
                alt=""
                srcset=""
                className="w-80 select-none pointer-events-none"
              />
              {/* <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/45/Chatlabai.jpg"
                alt=""
                style="display: block; width: 100%; height: auto;"
              /> */}
              <DraggablePoint
                id="point1"
                x="10px"
                y="10px"
                //onMouseDown={(x, y) => console.log(x, y)}
              />
              <DraggablePoint
                id="point2"
                x="100px"
                y="0"
                //onMouseDown={(x, y) => console.log(x, y)}
              />
              <DraggablePoint
                id="point3"
                x="0px"
                y="100px"
                //onMouseDown={(x, y) => console.log(x, y)}
              />
              <DraggablePoint
                id="point4"
                x="100px"
                y="100px"
                //onMouseDown={(x, y) => console.log(x, y)}
              />
              {/* <DraggablePoint id="point2" />
              <DraggablePoint id="point3" />
              <DraggablePoint id="point4" /> */}
            </div>
          </div>
          <div className="w-full md:w-1/2 p-2">
            <div className="bg-purple-100 rounded-lg p-4 h-48 flex justify-center items-center">
              {/* Placeholder for image */}
              <span className="text-purple-500">Image Preview</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col  justify-between rounded-lg w-32 pt-1 mx-auto">
          <div className="flex w-32 bg-purple-500">
            <div className="w-1/2 text-white p-1  flex justify-center items-center">
              x
            </div>
            <div className="w-1/2 text-white p-1  flex justify-center items-center">
              y
            </div>
          </div>
          <div className="flex w-32 bg-gray-50 ">
            <div className="w-1/2  p-1  flex justify-center items-center ">
              1
            </div>
            <div className="w-1/2  p-1  flex justify-center items-center">
              2
            </div>
          </div>
          <div className="flex w-32 bg-gray-100 ">
            <div className="w-1/2  p-1  flex justify-center items-center ">
              1
            </div>
            <div className="w-1/2  p-1  flex justify-center items-center">
              2
            </div>
          </div>
          <div className="flex w-32 bg-gray-50 ">
            <div className="w-1/2  p-1  flex justify-center items-center ">
              1
            </div>
            <div className="w-1/2  p-1  flex justify-center items-center">
              2
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
