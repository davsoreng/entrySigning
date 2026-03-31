export default {
    routes : [
        //ORGANIZATIONS
        {
            method:"GET",
            path:"/v1/organizations/:id?",
            handler:"organization.getOrganization"
        },
        {
            method:"POST",
            path:"/v1/organizations",
            handler:"organization.createOrganization"
        }
    ]
}