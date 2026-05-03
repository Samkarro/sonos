export type TextConfig = {
  content: string;
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
