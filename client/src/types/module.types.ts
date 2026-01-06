export interface Session {
    day: string;
    startTime: string;
    duration: number;
    location: string;
}

export interface Group {
    type: string;
    groupName: string;
    sessions: Session[];
}

export interface Module {
    code: string;
    name: string;
    sessions: Group[];
}