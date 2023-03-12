import CircularProgress from "@mui/material/CircularProgress";
import styled from "styled-components";
import { createListener } from "@roy1997/components";
import { useEffect, useState } from "react";

const Backdrop = styled.div`
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.4);
  display: none;
  &.visible {
    display: flex;
  }
`;
export const LoadingEvent = createListener<boolean>("liteon-web-potal-loading");
function Loading() {
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    LoadingEvent.init((e) => {
      setLoading(e.detail);
    });
    return function () {
      LoadingEvent.unmount();
    };
  }, []);

  return (
    <Backdrop className={loading ? "visible" : ""}>
      <CircularProgress />
    </Backdrop>
  );
}

export default Loading;
