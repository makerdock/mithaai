export interface NeynarWebhook {
    created_at: number
    type: string
    data: Data
}

export interface Data {
    object: string
    hash: string
    thread_hash: string
    parent_hash: string
    parent_url: string
    root_parent_url: string
    parent_author: ParentAuthor
    author: Author
    text: string
    timestamp: string
    embeds: Embed[]
    reactions: Reactions
    replies: Replies
    mentioned_profiles: MentionedProfile[]
}

export interface ParentAuthor {
    fid: number
}

export interface Author {
    object: string
    fid: number
    custody_address: string
    username: string
    display_name: string
    pfp_url: string
    profile: Profile
    follower_count: number
    following_count: number
    verifications: string[]
    verified_addresses: VerifiedAddresses
    active_status: string
    power_badge: boolean
}

export interface Profile {
    bio: Bio
}

export interface Bio {
    text: string
    mentioned_profiles: string[]
}

export interface VerifiedAddresses {
    eth_addresses: string[]
    sol_addresses: string[]
}

export interface Embed {
    url: string
}

export interface Reactions {
    likes: any[]
    recasts: any[]
}

export interface Replies {
    count: number
}

export interface MentionedProfile {
    object: string
    fid: number
    custody_address: string
    username: string
    display_name: string
    pfp_url: string
    profile: {
        bio: {
            text: string;
            mentioned_profiles: MentionedProfile[];
        };
    };
}
