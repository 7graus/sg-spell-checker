import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  pt: {
    translation: {
      general: {
        buttonTooltip:
          'Desbloqueie o acesso <br> com <a data-track-click="cta_pro_click_corrigir_texto_popup_feat_pro" href="https://www.sinonimos.com.br/assinar-pro/?utm_source=spell-checker&utm_medium=submitTooltip&utm_campaign=submitTooltip" class="{{ linkCssClass }}">Sinônimos PRO</a>',
        copy: 'Copiar',
        clear: 'Limpar',
        copied: 'Copiado',
        usage: 'Utilizações',
        characters: 'Caracteres',
        paste: 'Colar texto',
        'info1-mobile': 'Insira ou use o botão para colar.',
        'info1-desktop':
          'Insira ou cole seu texto (Ctrl + V) ou use o botão para colar.',
        info2: 'Frase ou pequeno texto',
        info4: 'Seu texto aparecerá aqui...',
      },
      title: 'Verificar Textos',
      options: {
        title: 'Escolha o estilo de escrita',
        formal: 'Formal',
        casual: 'Casual',
        professional: 'Profissional',
        humanize: 'Humanizar',
      },
      wordInput: {
        title: 'Palavras para excluir',
        placeholder: 'Digite as palavras que você deseja excluir...',
      },
      info: {
        errors: {
          spelling: 'Erros Ortográficos',
          grammar: 'Erros Gramaticais',
        },
      },
      editor: {
        main: {
          label: 'Texto para verificar',
          placeholder: 'Digite ou cole o texto que você deseja verificar...',
        },
        acceptAll: 'Aceitar todas as correções',
        acceptAllSuccess: 'Correções aplicadas',
        card: {
          title: {
            spelling: 'Erro Ortográfico',
            grammar: 'Erro Gramatical',
          },
          ignore: 'Ignorar',
        },
      },
      style: {
        label: 'Estilo',
        normal: {
          value: 'normal',
          label: 'Normal',
          description: 'Texto reescrito de forma natural, sem alterações profundas.',
        },
        formal: {
          value: 'formal',
          label: 'Formal',
          description: 'Texto reescrito de modo mais formal. Ideal para contextos profissionais.',
        },
        academic: {
          value: 'academic',
          label: 'Acadêmico',
          description: 'Texto reescrito com tom mais técnico. Ideal para monografias.',
        },
        direct: {
          value: 'direct',
          label: 'Direto',
          description: 'Texto reescrito de forma mais curta e direta, usando frases mais simples.',
        },
        humanize: {
          value: 'humanize',
          label: 'Humanizar',
          description: 'Texto reescrito de forma mais humana e natural.',
        },
      },
      creativity: {
        label: 'Criatividade',
        low: {
          value: '1',
          label: 'Baixa',
          description:
            'Baixa: Texto reescrito com poucas modificações, preservando a essência do original.',
        },
        medium: {
          value: '2',
          label: 'Média',
          description:
            'Média: Texto reescrito com modificações moderadas, preservando a essência do original.',
        },
        high: {
          value: '3',
          label: 'Alta',
          description:
            'Alta: Texto reescrito com várias modificações, gerando um texto mais criativo.',
        },
      },
      submit: 'Verificar texto',
      loading: 'Verificando texto...',
      results: {
        title: 'Resultados',
      },
      copy: 'Copiar',
      drawer: {
        title: 'Opções',
        close: 'Fechar',
      },
      error: {
        default: {
          title: 'Erro',
          description: 'Ocorreu um erro ao processar sua solicitação.',
        },
        usageLimitReached: 'Você atingiu o limite diário de utilizações.',
      },
      feedback: {
        question: 'O que achou da correção?',
        comment: 'Deixe um comentário (opcional)',
        submit: 'Enviar',
        submitting: 'Enviando...',
        thankyou: 'Obrigado pelo feedback!',
        success1: 'Obrigado. Como podemos melhorar mais?',
        success2: 'Obrigado. Como podemos melhorar?',
        success: {
          title: 'Obrigado!',
          text: 'Sua opinião nos ajuda a melhorar a experiência para todos. ',
        },
        close: 'Fechar',
        textareaPlaceholder: 'Escreva aqui para que possamos melhorar',
      },
      preloader: {
        title: 'Carregando anúncio',
        description: 'Por favor, aguarde enquanto carregamos o anúncio...',
      },
      convertionSite: {
        text1: 'Evolua sua escrita com o Sinônimos PRO',
        text2: 'Escreva sem limites, mais rápido e melhor',
        text_characters:
          'Escreva sem limites, <a data-track-click="cta_pro_click_corrigir_texto_editor_max_characters" href="https://www.sinonimos.com.br/assinar-pro/?utm_source=spell-checker&utm_medium=inlineMaxChars&utm_campaign=inlineMaxChars" class="{{ cssClass }}">desbloqueie o acesso completo!</a>',
        text_usage:
          'Escreva sem limites, <a data-track-click="cta_pro_click_corrigir_texto_editor_max_usage" href="https://www.sinonimos.com.br/assinar-pro/?utm_source=spell-checker&utm_medium=inlineMaxUsage&utm_campaign=inlineMaxUsage" class="{{ cssClass }}">desbloqueie o acesso completo!</a>',
        cta: 'Desbloquear acesso completo',
        popupUsage: {
          title: 'Você atingiu seu limite diário!',
          text: 'Escreva sem limites, mais rápido e melhor com o Sinônimos Pro',
          cta: {
            text: 'Desbloquear acesso completo',
            href: 'https://www.sinonimos.com.br/assinar-pro/?utm_source=spell-checker&utm_medium=popUpMaxUsage&utm_campaign=popUpMaxUsage',
          },
          close: 'Ignorar',
          list: {
            item1: 'Reescreva textos sem limite',
            item2: 'Resuma textos em todos os modos',
            item3: 'Detecte IA sem limites (versão beta)',
            item4: 'Navegação sem anúncios',
            lastItem: '... e muito mais!',
          },
          secondaryText: 'Volte em 24h para usar novamente.',
        },
        popupProWarning: {
          writtingStyle: {
            formal: {
              title: 'Estilo formal: escreva como um verdadeiro profissional!',
              text: 'Seu texto reescrito com tom formal e mais sofisticado. Ideal para contextos profissionais.',
            },
            academic: {
              title: 'Estilo acadêmico: eleve o nível do seu texto!',
              text: 'Seu texto reescrito com um tom acadêmico e mais técnico. Ideal para monografias e artigos científicos.',
            },
            direct: {
              title: 'Estilo direto: foque no essencial e vá direto ao ponto!',
              text: 'Seu texto reescrito de forma simples e direta, focando no essencial.',
            },
            humanize: {
              title: 'Estilo humanizador: escreva como um humano!',
              text: 'Seu texto reescrito com um tom humanizador e mais natural.',
            },
          },
          criativityLevel: {
            title: 'Modo Criativo: escreva de forma criativa e original!',
            text: 'Seu texto reescrito em um tom criativo e original, ideal para textos de marketing e publicidade.',
          },
          text: 'Ative o Sinônimos PRO para acessar este e outros modos exclusivos, sem limites!',
          cta: {
            text: 'Desbloquear acesso completo',
            href: 'https://www.sinonimos.com.br/assinar-pro/?utm_source=spell-checker&utm_medium=popUpProMode&utm_campaign=popUpProMode',
          },
        },
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 