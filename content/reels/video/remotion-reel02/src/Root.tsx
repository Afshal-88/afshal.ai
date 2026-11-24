import React from "react";
import { Composition } from "remotion";
import { Reel, totalFrames } from "./Reel";
export const Root: React.FC = () => (
  <Composition id="Reel02" component={Reel} durationInFrames={totalFrames} fps={30} width={1080} height={1920} />
);
