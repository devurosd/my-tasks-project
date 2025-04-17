export interface Task {
    id: String;
    title: String;
    done: boolean;
}

export type TaskFilter = "all" | "todo" | "done";
