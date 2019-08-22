var storeProcedure = {
  common: {
    // grid: 'CALL st_grid(?,?,?,?,?,?,?,?)',
    grid: 'CALL st_grid1(?,?,?,?,?,?,?,?,?)'
  },
  user: {
    st_login: 'st_login',
    get_user_by_name: 'st_get_user_by_name',
    gridView: 'st_grid_user'
  },
  category: {
    getByCode: 'CALL st_category_by_code(?)',
    insert: 'st_insert_category',
    getAll: 'st_get_all_category',
    gridView: 'CALL st_grid_category(?,?,?,?,?,?,?,?)'
  },
  category_news: {
    getByCode: 'CALL st_category_news_by_code(?)',
    insert: 'st_insert_category_news',
    getAll: 'st_get_all_category_news',
    gridView: 'CALL st_grid_category_news(?,?,?,?,?,?,?,?)'
  },
  category_product: {
    getByCode: 'CALL st_category_product_by_code(?)',
    insert: 'st_insert_category_product',
    getAll: 'st_get_all_category_product',
    gridView: 'CALL st_grid_category_product(?,?,?,?,?,?,?,?)'
  },
  partner: {
    getAll: 'st_get_all_partner',
    getPartnerByCode: 'st_partner_by_code',
    gridView: 'CALL st_grid_partner(?,?,?,?,?,?,?,?)'
  },
  home: {
    getManagerHome: 'st_get_all_manager_homepage',
    insert: 'st_insert_home_manager'
  },
  blog: {
    st_get_blog_by_category_and_limit: 'st_get_blog_by_category_and_limit',
    insert: 'st_insert_blog',
    gridView: 'CALL st_grid_blogs(?,?,?,?,?,?,?,?)',
    getBlogByCode: 'st_blog_by_code'
  },
  news: {
    st_get_news_by_category_news_and_limit: 'st_get_news_by_category_news_and_limit',
    insert: 'st_insert_news',
    gridView: 'CALL st_grid_news(?,?,?,?,?,?,?,?)',
    getNewsByCode: 'st_news_by_code'
  },
  product: {
    st_get_product_by_category_product_and_limit: 'st_get_product_by_category_product_and_limit',
    insert: 'st_insert_product',
    gridView: 'CALL st_grid_product(?,?,?,?,?,?,?,?)',
    getNewsByCode: 'st_product_by_code'
  },
  web: {
    getAllCategory: 'st_get_all_category',
    getBlogByCategoryName: 'st_get_blogs_by_category_name'
  },
  video: {
    getVideoByCode: 'st_video_by_code',
    gridView: 'CALL st_grid_video(?,?,?,?,?,?,?,?)'
  },
  permission: {
    getPermissionByCode: 'st_permission_by_code'
  },
  home_content: {
    gridView: 'CALL st_grid_home_content(?,?,?,?,?,?,?,?)'
  },
  header: {
    gridView: 'CALL st_grid_header(?,?,?,?,?,?,?,?)'
  },
  MNav: 'MNavSystemGetFirst'
}

module.exports = storeProcedure