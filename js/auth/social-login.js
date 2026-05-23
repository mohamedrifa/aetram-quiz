function initSocialLogin() {

  $('.social-btn').on(
    'click',
    function () {

      AetramToast.info(
        'Social login integration — connect OAuth API'
      );

    }
  );

}