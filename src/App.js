import { useState, useEffect, useRef } from "react";
import "./styles.css";

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollElementsRef = useRef([]);

  const generateNumber = () => {
    return Math.round(Math.random() * 1000);
  };

  const delayFunc = (func) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const val = func();
          resolve(val);
        } catch (err) {
          reject(err);
        }
      }, 50);
    });
  };

  const fetchData = async (len) => {
    const newData = [];
    setLoading(true);
    for (let i = 0; i < len; i++) {
      newData.push(await delayFunc(generateNumber));
    }
    setLoading(false);
    setData((prev) => [...prev, ...newData]);
  };

  useEffect(() => {
    fetchData(20);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((elements) => {
      if (elements[0].isIntersecting && !loading) {
        fetchData(20);
      }
    });

    const elem = scrollElementsRef.current.at(-1);
    if (elem) {
      observer.observe(elem);
    }

    return () => {
      if (elem) {
        observer.unobserve(elem);
      }
    };
  }, [data]);

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    const clientHeight = e.target.clientHeight;
    const scrollHeight = e.target.scrollHeight;
    const scrollBottomLeft = scrollHeight - (clientHeight + scrollTop);

    const THRESHOLD = 20;
    if (scrollBottomLeft <= THRESHOLD) {
      fetchData(20);
    }
  };

  return (
    <div className="App">
      {data.map((val, idx) => {
        return (
          <p
            ref={(el) => (scrollElementsRef.current[idx] = el)}
            className="item"
            key={idx}
          >
            {val}
          </p>
        );
      })}
      {loading && <p>Loading</p>}
    </div>
  );
}
