/* Meta Pixel da página de venda do Claude do Zero (PIXEL JayAI). Externo, como o do Tarot. */
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','976405741684117');
fbq('track','PageView');
fbq('track','ViewContent',{content_name:'Claude do Zero',content_type:'product',value:297,currency:'BRL'});

/* Repasse de UTMs, src e sck para o checkout da Hotmart e evento ClickCheckout no clique.
   InitiateCheckout e Purchase chegam do servidor da Hotmart; o clique usa evento próprio para não contar em dobro. */
(function () {
  // Só estes parâmetros seguem para o checkout. Qualquer outro da URL (e-mail, token) fica de fora.
  var PARAMS_PERMITIDOS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'src', 'sck'];

  function setupCheckoutTracking() {
    try {
      var currentParams = new URLSearchParams(window.location.search);
      var srcVal = currentParams.get('src') || currentParams.get('utm_content') || currentParams.get('utm_campaign') || currentParams.get('utm_source');
      var links = document.querySelectorAll('a[data-checkout], a[href*="pay.hotmart.com"]');

      links.forEach(function (link) {
        try {
          var checkoutUrl = new URL(link.href, window.location.origin);
          PARAMS_PERMITIDOS.forEach(function (key) {
            var val = currentParams.get(key);
            if (val) checkoutUrl.searchParams.set(key, val.slice(0, 100));
          });
          if (srcVal && !checkoutUrl.searchParams.has('src')) checkoutUrl.searchParams.set('src', srcVal.slice(0, 100));
          // O sck do anúncio vence; sem ele, o sck diz de qual botão da página veio o clique.
          var pos = link.getAttribute('data-posicao');
          if (pos && !checkoutUrl.searchParams.has('sck')) checkoutUrl.searchParams.set('sck', pos);
          link.href = checkoutUrl.toString();
        } catch (err) {
          console.warn('[Tracking] Erro ao atualizar link:', err);
        }

        link.addEventListener('click', function () {
          if (typeof fbq === 'function') {
            fbq('trackCustom', 'ClickCheckout', {
              content_name: 'Claude do Zero',
              posicao: link.getAttribute('data-posicao') || ''
            });
          }
        });
      });
    } catch (e) {
      console.warn('[Tracking] Erro na inicialização:', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupCheckoutTracking);
  } else {
    setupCheckoutTracking();
  }
})();
