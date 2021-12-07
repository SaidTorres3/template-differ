import { Change } from "diff";
export declare const createDiffVisualizer: (opts: {
    diff: Change[];
    savePath: string;
    dataPath?: string;
}) => void;
