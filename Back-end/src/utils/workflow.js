export const STATUS = {
  TODO: "todo",
  IN_PROGRESS: "inprogress",
  REVIEW: "review",
  DONE: "done",
};

export const ROLE = {
  ADMIN: "admin",
  MEMBER: "user",
};

const ALLOWED_TRANSITIONS = {
  [ROLE.ADMIN]: {
    [STATUS.REVIEW]: [STATUS.DONE, STATUS.IN_PROGRESS],
  },
  [ROLE.MEMBER]: {
    [STATUS.TODO]: [STATUS.IN_PROGRESS],
    [STATUS.IN_PROGRESS]: [STATUS.REVIEW],
  },
};

export function isAllowedTransition(fromStatus, toStatus, userRole) {
  if (fromStatus === toStatus) return true;
  const roleTransitions = ALLOWED_TRANSITIONS[userRole];
  if (!roleTransitions) return false;
  const allowed = roleTransitions[fromStatus];
  if (!allowed) return false;
  return allowed.includes(toStatus);
}

export function validateTransition(fromStatus, toStatus, userRole) {
  if (!fromStatus || !toStatus || !userRole) {
    return { allowed: false, reason: "Missing required parameters." };
  }

  if (fromStatus === STATUS.DONE) {
    return { allowed: false, reason: "Completed tasks cannot be changed." };
  }

  const allowed = isAllowedTransition(fromStatus, toStatus, userRole);
  if (!allowed) {
    const roleName = userRole === ROLE.ADMIN ? "Admins" : "Members";
    return {
      allowed: false,
      reason: `${roleName} cannot move tasks from "${fromStatus}" to "${toStatus}".`,
    };
  }

  return { allowed: true };
}
