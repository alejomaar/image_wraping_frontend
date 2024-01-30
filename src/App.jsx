import React, { useState, useCallback, useRef } from "react";
import axios from "axios";
import "./App.css";

const postData = async () => {
  const data = {
    url: "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fe%2Fe2%2FA_studio_image_of_a_hand_of_playing_cards._MOD_45148377.jpg&f=1&nofb=1&ipt=982488faf2b7b347563830f58c00e7503ef6c18b387d23ae5d7bad3ab658b215&ipo=images",
    src_points: [
      [1200, 520],
      [2377, 317],
      [1541, 2365],
      [2765, 2149],
    ],
    width: 600,
    height: 800,
  };

  const url = "https://us-east1-nth-micron-411415.cloudfunctions.net/function";
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer your_token_here",
  };

  try {
    const response = await axios.post(url, data, {
      headers: headers,
      responseType: "blob", // Important to handle the response as a Blob
    });
    const urlBlob = URL.createObjectURL(new Blob([response.data]));
    return urlBlob;
    //document.getElementById("yourImageId").src = urlBlob; // Assuming you have an img tag with id='yourImageId'
  } catch (error) {
    console.log(error);
  }
};

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
      //console.log(point.style.left, point.style.top, parent.offsetLeft);
      //console.log(point.style.left, point.style.top);
      console.log(pageX);
      setCoordinate(() => point.style.left, point.style.top);
      onMouseDown(point.style.left, point.style.top);
    }

    //moveAt(event.pageX, event.pageY);

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
  const [coordinates, setCoordinates] = useState([
    { x: 0, y: 0 },
    { x: 100, y: 10 },
    { x: 10, y: 100 },
    { x: 100, y: 100 },
  ]);
  const [imageUrl, setImageUrl] = useState(null);

  const imageRequest = async () => {
    const urlBlob = await postData();
    setImageUrl(urlBlob);
  };

  return (
    <div className="flex flex-col sm:w-full md:w-7/12 lg:min-w-md mx-auto ">
      <div className="bg-white rounded-lg p-4 shadow-lg sm:m-2">
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

          <button
            onClick={imageRequest}
            className="w-full sm:w-auto px-6 py-2 mx-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 focus:outline-none"
          >
            Process
          </button>
        </div>
        <div className="flex flex-wrap justify-between ">
          <div className="h-full w-[45%] rounded-lg border-gray-300 border-2 p-2">
            <div className=" inline-block relative">
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
                x={coordinates[0].x + "px"}
                y={coordinates[0].y + "px"}
                onMouseDown={(x, y) => {
                  const coordinatesCopy = [...coordinates];
                  coordinatesCopy[0].x = x;
                  coordinatesCopy[0].y = y;
                  setCoordinates(coordinatesCopy);
                }}
              />
              <DraggablePoint
                id="point2"
                x={coordinates[1].x + "px"}
                y={coordinates[1].y + "px"}
                onMouseDown={(x, y) => {
                  const coordinatesCopy = [...coordinates];
                  coordinatesCopy[1].x = x;
                  coordinatesCopy[1].y = y;
                  setCoordinates(coordinatesCopy);
                }}
              />
              <DraggablePoint
                id="point3"
                x={coordinates[2].x + "px"}
                y={coordinates[2].y + "px"}
                onMouseDown={(x, y) => {
                  const coordinatesCopy = [...coordinates];
                  coordinatesCopy[2].x = x;
                  coordinatesCopy[2].y = y;
                  setCoordinates(coordinatesCopy);
                }}
              />
              <DraggablePoint
                id="point4"
                x={coordinates[3].x + "px"}
                y={coordinates[3].y + "px"}
                onMouseDown={(x, y) => {
                  const coordinatesCopy = [...coordinates];
                  coordinatesCopy[3].x = x;
                  coordinatesCopy[3].y = y;
                  setCoordinates(coordinatesCopy);
                }}
              />
              {/* <DraggablePoint id="point2" />
              <DraggablePoint id="point3" />
              <DraggablePoint id="point4" /> */}
            </div>
          </div>
          <div className="w-[45%] rounded-lg border-gray-300 border-2 p-2">
            <div className="w-full h-full inline-block relative">
              {imageUrl && (
                <img
                  src={imageUrl}
                  className=" absolute max-h-full max-w-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  alt="Response Image"
                />
              )}
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
              {coordinates[0].x}
            </div>
            <div className="w-1/2  p-1  flex justify-center items-center">
              {coordinates[0].y}
            </div>
          </div>
          <div className="flex w-32 bg-gray-100 ">
            <div className="w-1/2  p-1  flex justify-center items-center ">
              {coordinates[1].x}
            </div>
            <div className="w-1/2  p-1  flex justify-center items-center">
              {coordinates[1].y}
            </div>
          </div>
          <div className="flex w-32 bg-gray-50 ">
            <div className="w-1/2  p-1  flex justify-center items-center ">
              {coordinates[2].x}
            </div>
            <div className="w-1/2  p-1  flex justify-center items-center">
              {coordinates[2].y}
            </div>
          </div>
          <div className="flex w-32 bg-gray-50 ">
            <div className="w-1/2  p-1  flex justify-center items-center ">
              {coordinates[3].x}
            </div>
            <div className="w-1/2  p-1  flex justify-center items-center">
              {coordinates[3].y}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
