export const hasAccess = (roles, rolesToCheck, action) => {

    // const updatedAccessData = roles.reduce((acc, role) => {
    //     if (rolesToCheck.includes(role.roleName)) {
    //         const updatedRole = {
    //             ...role,
    //             access: role.access.filter(item => !(item.title === 'call' && item.view === false && item.create === false && item.update === false && item.delete === false)),
    //         };
    //         acc.push(updatedRole);
    //     } else {
    //         acc.push(role);
    //     }
    //     return acc;
    // }, []);

    // console.log(updatedAccessData)

    const access = rolesToCheck.map((roleToCheck) => {
        const role = roles.find((r) => r.roleName === roleToCheck);
        return role?.access?.find((a) => a.title === action);
    });

    const mergedPermissions = {};

    access.forEach((permission) => {
        const { title, ...rest } = permission;

        if (!mergedPermissions[title]) {
            mergedPermissions[title] = { ...rest };
        } else {
            // Merge with priority to true values
            Object.keys(rest).forEach((key) => {
                if (mergedPermissions[title][key] !== true) {
                    mergedPermissions[title][key] = rest[key];
                }
            });
        }
    });

    return mergedPermissions;
};