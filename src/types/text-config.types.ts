export type TextConfig = {
  content: string;
  x: number;
  y: number;
  fontFamily: string;
  fontSize: number;
  fill: string;
  fontWeight:
    | "normal"
    | "bold"
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900";
  align: "left" | "center" | "right";
};
