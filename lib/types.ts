export type ScopeJSON = {
    product_direction: string;
    problem: string;
    target_user: string;
    product_goal: string;
    mvp_scope: string[];
    anti_scope: { item: string; reason: string }[];
    roadmap: {
        phase_1: { title: string; actions: string[] };
        phase_2: { title: string; actions: string[] };
        phase_3: { title: string; actions: string[] };
    };
    success_metric: string;
    next_move: string;
};

export type Project = {
    id: string;
    title: string | null;
    idea: string;
    industry: string | null;
    experience: string | null;
    generated_scope: ScopeJSON;
    is_favorite: boolean;
    created_at: string;
};