BÀI NÀY VIẾT VỀ AUTHENTICATION MỘT CÁCH HOẢN CHỈNH CHÚC NĂNG REGISER LOGIN LOGOUT 1 TRANG WEB
CÓ ĐẦY ĐỦ CẢ RESETPASSWORD XÁC THỰC Ở EMAIL HAY LÀ CHECK JWT ACCESSTOKEN VS REFRESHTOKEN
CẢM ƠN CÁC BẠN ĐÃ THẢM KHẢO BÀI CODE CỦA CHÚNG TÔI .... 






Đây là 1 chức năng login vs nhiều tháng trải qua tìm hiểu từ html css js đến reactjs nodejs cơ sở dữ liệu 
mạng máy tính, hay các cấu trúc syntax có 1 chút chút bảo mật nhg k hiểu rõ lắm 
luyện thuật toán hay các bài toán đố kiểu từ cơ bản đến khó hơn 

vì mỗi trang web đều có cái này nên là tôi đã dành nó đã viết ra và đag nhờ 1 bạn fe reactjs viết thêm để xử lý các accestoken .....

nếu ai có góp ý vô này hoàn hảo để sau này code thì chỉ cần lấy source này ra thôi để code vô thẳng phần thân để ít tốn thời gian hơn xin hãy liên hệ ở gmail của tôi (tknhu1302@gmail.com)


Bài code này của 1 non-it tự học chưa hoàn chỉnh mong có sai sót xin hãy góp ý qua gmail để tui hoàn chỉnh nó cho các project trong tương lai


Dưới đây là cấu trúc bên FE REACTJS để xử lý request nha sử dụng axios
 const refreshToken = async () => {
    try {
      const res = await axios.post("/refresh", { token: user.refreshToken });
      setUser({
        ...user,
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      });
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const axiosJWT = axios.create()

  axiosJWT.interceptors.request.use(
    async (config) => {
      let currentDate = new Date();
      const decodedToken = jwt_decode(user.accessToken);
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        const data = await refreshToken();
        config.headers["authorization"] = "Bearer " + data.accessToken;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );










