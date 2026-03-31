export default {
    routes : [
        //OBTENER TODAS LOS ORGANIZATION MEMBER + POR ID DE REGISTRO
        {
            method:"GET",
            path:"/v1/organizations-members/:id?",
            handler:"organization-member.getOrgMemeber"
        },
        //CREAR ORGANIZATION MEMBER
        {
            method:"POST",
            path:"/v1/organizations-members",
            handler:"organization-member.createOrgMemeber"
        },
        //OBTENER TODAS LOS ORGANIZATION MEMEBER POR ORGANIZATION
        {
            method:"GET",
            path:"/v1/organizations-members/:id/members",
            handler:"organization-member.getOrgMemberByOrg"
        },
    ]
}