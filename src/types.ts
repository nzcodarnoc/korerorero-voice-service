export interface MouthCues {
  start: number;
  end: number;
  value: string;
}
export interface ShapesPayload {
  data: {
    metadata: {
      soundFile: string;
      duration: number;
    };
    mouthCues: Array<MouthCues>;
  };
}
