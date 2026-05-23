function initTypingEffect() {

  var typingPhrases = [
    'Secure AI-proctored assessments for global enterprises.',
    'Real-time analytics powering smarter hiring decisions.',
    'Trusted by multinational HR teams worldwide.'
  ];

  var phraseIndex = 0;

  var charIndex = 0;

  var isDeleting = false;

  function typeText() {

    var el = $('#typing-text');

    if (!el.length) return;

    var current = typingPhrases[phraseIndex];

    var display = isDeleting
      ? current.substring(0, charIndex - 1)
      : current.substring(0, charIndex + 1);

    charIndex = isDeleting ? charIndex - 1 : charIndex + 1;

    el.html(display + '<span class="typing-cursor"></span>');

    if (!isDeleting && charIndex === current.length) {

      setTimeout(function () {

        isDeleting = true;

        typeText();

      }, 2000);

      return;
    }

    if (isDeleting && charIndex === 0) {

      isDeleting = false;

      phraseIndex = (phraseIndex + 1) % typingPhrases.length;

    }

    setTimeout(typeText, isDeleting ? 40 : 80);

  }

  typeText();

}