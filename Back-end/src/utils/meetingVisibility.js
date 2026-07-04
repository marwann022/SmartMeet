export const buildMeetingOrClauses = (user, sameCommunityAdminIds) => {
    const isReqUserAdmin = user.role === "admin";
    const orClauses = [];

    if (isReqUserAdmin) {
        orClauses.push({ host: user._id });
        orClauses.push({
            $or: [
                { "participants.email": user.email },
                { "participants.name": user.name },
                { "participants.name": `${user.firstName} ${user.lastName}`.trim() }
            ],
            type: { $ne: "Team" }
        });
    } else {
        orClauses.push({ host: user._id });
        orClauses.push({ "participants.email": user.email });
        orClauses.push({ "participants.name": user.name });
        orClauses.push({ "participants.name": `${user.firstName} ${user.lastName}`.trim() });

        if (sameCommunityAdminIds.length > 0) {
            orClauses.push({
                host: { $in: sameCommunityAdminIds },
                type: "Team"
            });
        }
    }

    return orClauses;
};

export const getCommunityAdminIds = async (UserModel, communityId) => {
    if (!communityId) return [];
    const admins = await UserModel.find({ community: communityId, role: "admin" }).select("_id");
    return admins.map(a => a._id);
};
