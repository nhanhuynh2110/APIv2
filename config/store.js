var storeProcedure = {
  user: {
    st_login: 'st_login',
    get_user_by_name: 'st_get_user_by_name',
    gridView: 'st_grid_user'
  },
  category: {
    getCategoryByCode: 'st_category_by_code',
    insert: 'st_insert_category',
    getAll: 'st_get_all_category',
    gridView: 'st_grid_category'
  },
  partner: {
    getAll : 'st_get_all_partner',
    getPartnerByCode: 'st_partner_by_code',
    gridView: 'st_grid_partner'
  },
  home: {
    getManagerHome : 'st_get_all_manager_homepage',
    insert: 'st_insert_home_manager'
  },
  blog: {
    st_get_blog_by_category_and_limit: 'st_get_blog_by_category_and_limit',
    insert: 'st_insert_blog',
    gridView: 'st_grid_blogs',
    getBlogByCode: 'st_blog_by_code'
  },
  web: {
    getAllCategory: 'st_get_all_category',
    getBlogByCategoryName: 'st_get_blogs_by_category_name'
  },
  video: {
    getVideoByCode: 'st_video_by_code',
    gridView: 'st_grid_video'
  },
  permission: {
    getPermissionByCode: 'st_permission_by_code'
  },
  MNav: 'MNavSystemGetFirst'
}

module.exports = storeProcedure