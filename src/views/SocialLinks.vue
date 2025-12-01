<template>
  <div :class="`min-h-screen w-full bg-gradient-to-br ${themeBgClass} text-white relative overflow-hidden`">
    <!-- Creative Animated Background - Theme Based -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div :class="`absolute top-0 left-0 w-full h-full bg-gradient-to-br ${themeBgOverlayClass}`"></div>
      <div
        :class="`absolute top-1/4 -left-20 w-96 h-96 ${themeOrb1Class} rounded-full blur-3xl opacity-30 animate-float`">
      </div>
      <div
        :class="`absolute bottom-1/4 -right-20 w-96 h-96 ${themeOrb2Class} rounded-full blur-3xl opacity-25 animate-float-delay`">
      </div>
      <div
        :class="`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] ${themeOrb3Class} rounded-full blur-3xl opacity-20 animate-pulse-slow`">
      </div>
      <div
        :class="`absolute top-3/4 left-1/4 w-72 h-72 ${themeOrb4Class} rounded-full blur-3xl opacity-15 animate-float`">
      </div>
    </div>

    <!-- Main Container -->
    <div class="relative z-10 min-h-screen flex flex-col">
      <!-- Top Bar -->
      <div class="flex justify-between items-center p-6">
        <button @click="goToHome"
          :class="`group relative px-4 py-2 overflow-hidden rounded-full border-2 border-white/20 ${themeHoverBorderClass} transition-all`">
          <span :class="`relative z-10 flex items-center gap-2 text-white ${themeTextHoverClass}`">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span class="font-bold">BACK</span>
          </span>
          <div :class="`absolute inset-0 bg-gradient-to-r ${themeBackButtonGradientClass} transition-all`"></div>
        </button>
        <LanguageSwitcher />
      </div>

      <!-- Hero Profile Section - Creative Layout -->
      <div class="flex-1 flex items-center justify-center px-6 py-12">
        <div class="w-full max-w-4xl">
          <!-- Asymmetric Profile Layout -->
          <div class="relative mb-16">
            <!-- Large Profile Image with Creative Effects -->
            <div class="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
              <div class="relative group">
                <!-- Glowing Rings - Theme Based -->
                <div
                  :class="`absolute -inset-4 bg-gradient-to-r ${themeGradientRingsClass} rounded-full blur-2xl opacity-60 group-hover:opacity-90 transition-opacity animate-spin-slow`">
                </div>
                <div
                  :class="`absolute -inset-2 bg-gradient-to-r ${themeGradientClass} rounded-full blur-xl opacity-40 group-hover:opacity-70 transition-opacity animate-spin-reverse`">
                </div>
                <div
                  :class="`absolute -inset-6 bg-gradient-to-r ${themeGradientRingsClass} rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity animate-pulse-slow`">
                </div>

                <!-- Profile Image -->
                <div class="relative">
                  <img :src="userProfileImage || '/src/assets/images/man.png'" alt="Profile"
                    :class="`relative w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-4 ${themeProfileBorderClass} shadow-2xl ${themeProfileShadowClass} transform group-hover:scale-105 transition-transform`">
                  <!-- Floating Badge - Theme Based -->
                  <div v-if="userTag"
                    :class="`absolute -bottom-4 -right-4 px-4 py-2 bg-gradient-to-r ${themeGradientClass} rounded-full shadow-xl ${themeBadgeShadowClass} transform rotate-12 hover:rotate-0 transition-transform border-2 ${themeBadgeBorderClass}`">
                    <span class="text-white text-xs font-black uppercase tracking-wider">{{ formatTagName(userTag)
                    }}</span>
                  </div>
                </div>
              </div>

              <!-- Name with Creative Typography - Theme Based -->
              <div class="flex-1 text-center md:text-left">
                <h1 class="text-6xl md:text-8xl font-black mb-4 leading-none">
                  <span
                    :class="`block bg-gradient-to-r ${themeGradientClass} bg-clip-text text-transparent animate-gradient`">
                    {{ userName || `User ID: ${userId}` }}
                  </span>
                </h1>
                <div
                  :class="`h-1 w-32 bg-gradient-to-r ${themeGradientRingsClass} mx-auto md:mx-0 mb-6 shadow-lg ${themeUnderlineShadowClass}`">
                </div>
                <p class="text-xl md:text-2xl text-white leading-relaxed max-w-2xl">
                  {{ userDescription || 'No description available' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Creative Links Section -->
          <div class="space-y-6">
            <!-- Loading state - Theme Based -->
            <div v-if="isLoading" class="text-center py-20">
              <div class="inline-block relative">
                <div
                  :class="`w-16 h-16 border-4 ${themeLoadingBorder1Class} border-t-transparent rounded-full animate-spin`">
                </div>
                <div
                  :class="`absolute inset-0 w-16 h-16 border-4 ${themeLoadingBorder2Class} border-b-transparent rounded-full animate-spin-reverse`">
                </div>
                <div
                  :class="`absolute inset-2 w-12 h-12 border-4 ${themeLoadingBorder3Class} border-l-transparent rounded-full animate-spin`">
                </div>
              </div>
              <p class="mt-6 text-gray-300 text-lg">{{ t('socialLinks.loadingLinks') }}</p>
            </div>

            <!-- Error state -->
            <div v-else-if="error" class="text-center py-20">
              <p class="text-red-400 text-xl">{{ error }}</p>
            </div>

            <!-- No links -->
            <div v-else-if="socialLinks.length === 0" class="text-center py-20">
              <p class="text-gray-400 text-xl">{{ t('socialLinks.noLinksAvailable') }}</p>
            </div>

            <!-- Creative Link Cards -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <a v-for="(link, index) in socialLinks" :key="index" @click="openLink(link.link)"
                :style="{ animationDelay: `${index * 100}ms` }"
                :class="`group relative block overflow-hidden rounded-3xl border-2 border-white/10 ${themeLinkHoverBorderClass} transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${themeLinkShadowClass} creative-link`"
                style="text-decoration: none;">

                <!-- Animated Background Gradient - Theme Based -->
                <div
                  :class="`absolute inset-0 bg-gradient-to-br ${themeLinkGradientHoverClass} transition-all duration-500`">
                </div>

                <!-- Content -->
                <div class="relative p-8 bg-black/50 backdrop-blur-sm">
                  <div class="flex items-start gap-6">
                    <!-- Icon with Creative Design - Theme Based -->
                    <div class="relative flex-shrink-0">
                      <div
                        :class="`absolute inset-0 bg-gradient-to-br ${themeGradientRingsClass} rounded-2xl blur-md opacity-60 group-hover:opacity-90 transition-opacity`">
                      </div>
                      <div
                        :class="`absolute -inset-1 bg-gradient-to-br ${themeGradientClass} rounded-2xl blur-sm opacity-30 group-hover:opacity-50 transition-opacity`">
                      </div>
                      <div
                        :class="`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${themeGradientClass} border-2 ${themeBorderClass}/30 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg ${themeIconShadowClass}`">
                        <img :src="getIconPath(link.icon)" :alt="link.platform"
                          class="w-10 h-10 object-contain filter brightness-0 invert">
                      </div>
                    </div>

                    <!-- Text Content -->
                    <div class="flex-1 min-w-0">
                      <h3
                        :class="`text-2xl font-black mb-2 text-white group-hover:text-transparent group-hover:bg-gradient-to-r ${themeGradientClass} group-hover:bg-clip-text transition-all`">
                        {{ link.title }}
                      </h3>
                      <p class="text-gray-300 text-sm leading-relaxed line-clamp-2 mb-4">
                        {{ link.description }}
                      </p>

                      <!-- Creative Arrow - Theme Based -->
                      <div
                        :class="`flex items-center gap-2 ${themeTextClass} opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300`">
                        <span class="text-xs font-bold uppercase tracking-widest">EXPLORE</span>
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
                            d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Decorative Corner Element - Theme Based -->
                <div :class="`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${themeCorner1Class} transition-all`">
                </div>
                <div
                  :class="`absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr ${themeCorner2Class} transition-all`">
                </div>
                <div :class="`absolute top-0 left-0 w-16 h-16 bg-gradient-to-br ${themeCorner3Class} transition-all`">
                </div>
              </a>
            </div>
          </div>

          <!-- Creative Footer - Theme Based -->
          <div
            :class="`mt-12 flex items-center justify-between p-6 rounded-2xl border-2 ${themeFooterBorderClass} bg-black/40 backdrop-blur-sm shadow-xl ${themeFooterShadowClass}`">
            <button @click="handleReportClick"
              :class="`group relative px-6 py-3 overflow-hidden rounded-full border-2 ${themeReportButtonBorderClass} transition-all shadow-lg ${themeReportButtonShadowClass}`">
              <span :class="`relative z-10 flex items-center gap-2 text-white group-hover:text-white`">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd" />
                </svg>
                <span class="font-bold">{{ t('socialLinks.reportUser') }}</span>
              </span>
              <div :class="`absolute inset-0 bg-gradient-to-r ${themeReportButtonGradientClass} transition-all`"></div>
            </button>

            <svg width="75" height="auto" viewBox="0 0 218 76" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M35.1426 70.0746C27.1577 70.0746 19.1728 70.0483 11.1879 70.0852C6.07639 70.1089 1.10726 66.5527 0.0686144 60.5581C-0.0131062 60.0889 0.0237999 59.596 0.0237999 59.1135C0.0211637 43.1859 0.0659782 27.261 7.45519e-05 11.3334C-0.0210146 6.05845 4.43407 0.419728 10.9348 0.422364C25.6313 0.432909 40.3305 0.430273 55.027 0.440817C56.7379 0.440817 58.4487 0.438181 60.157 0.511993C65.163 0.728157 69.5654 5.21488 70.111 9.87822C70.2639 11.1805 70.343 12.4986 70.3457 13.8087C70.3615 28.6819 70.3615 43.555 70.3536 58.4281C70.3509 63.479 67.5935 67.6547 63.0514 69.3207C61.8494 69.7609 60.5102 70.0325 59.2317 70.043C51.202 70.1063 43.1749 70.0746 35.1452 70.0746H35.1426ZM39.5423 49.1436C38.4931 53.6514 40.8999 58.4334 45.5079 59.9808C49.8259 61.4307 54.5103 59.4035 56.527 55.2621C57.5445 53.169 57.7818 50.9784 57.1096 48.7667C56.1764 45.7008 54.0701 43.6499 51.2125 42.5005V27.5589C56.6693 25.3023 58.5515 20.204 56.9145 15.7436C55.404 11.626 50.9647 8.69196 45.9086 10.0496C43.7127 10.6374 41.9965 11.9529 40.776 13.872C39.2444 16.2762 38.8753 18.8622 39.7374 21.617C35.4615 24.2347 31.2358 26.8207 27.0127 29.4068C21.7957 24.7224 16.6605 26.0404 13.5367 29.1326C10.2705 32.3646 10.202 37.8372 12.9857 41.222C14.4277 42.975 16.2783 44.1244 18.5111 44.4645C21.6112 44.9363 24.3792 44.0901 26.6173 41.918C31.0012 44.3669 35.2875 46.7606 39.5476 49.141L39.5423 49.1436Z"
                fill="white" />
              <path
                d="M119.873 57.9536H114.43V32.7441H119.386C123.211 37.9663 127.096 43.2729 131.148 48.8062V32.752H136.478V57.9246H131.222C127.534 52.8632 123.764 47.6937 119.871 42.3503V57.9536H119.873Z"
                fill="white" />
              <path
                d="M117.014 26.3725C110.165 26.6493 103.538 21.1345 103.588 13.1048C103.636 5.45206 109.506 -0.0205818 117.191 0.0400496C125.073 0.100681 130.522 6.29563 130.416 13.3948C130.3 21.2584 123.947 26.5992 117.014 26.3699V26.3725ZM109.243 13.1364C109.243 17.4281 112.388 21.2109 117.138 21.2083C121.29 21.2083 124.78 17.8894 124.83 13.35C124.883 8.50999 121.206 5.47051 117.407 5.25171C113.168 5.00655 109.187 8.62334 109.243 13.1364Z"
                fill="white" />
              <path
                d="M176.611 25.8293H170.735C174.094 17.3541 177.429 8.9369 180.755 0.540771H186.702C189.977 8.93426 193.248 17.3225 196.554 25.7924H190.491C189.882 24.1923 189.254 22.5421 188.616 20.8681H178.436C177.84 22.492 177.244 24.1132 176.614 25.8267L176.611 25.8293ZM186.992 16.2575C185.859 13.1679 184.773 10.2023 183.605 7.02306C182.419 10.2471 181.327 13.218 180.21 16.2575H186.99H186.992Z"
                fill="white" />
              <path
                d="M142.258 57.9113V32.7466H147.543V43.6471C147.614 43.6893 147.688 43.7315 147.759 43.7763C150.714 40.0988 153.672 36.4188 156.654 32.7097H163.376C160.254 36.4003 157.186 40.025 154.07 43.7051C157.268 48.4132 160.465 53.1188 163.739 57.9403H157.107C154.858 54.6135 152.596 51.2603 150.274 47.8254C149.343 48.9167 148.466 49.9422 147.601 50.9545V57.9139H142.255L142.258 57.9113Z"
                fill="white" />
              <path
                d="M80.7716 22.4789C81.9078 21.0316 83.0097 19.6265 84.1696 18.1477C84.5703 18.5721 84.9499 18.9649 85.3189 19.3682C87.2881 21.5325 89.8373 21.862 92.5262 21.5167C93.1457 21.4376 93.8073 20.9393 94.2607 20.4569C95.2915 19.3603 95.0885 17.8524 93.7757 17.1222C92.7634 16.5607 91.6246 16.2127 90.5227 15.8252C89.2125 15.3665 87.8496 15.0396 86.5606 14.5256C83.0967 13.1443 81.5466 10.9404 81.6811 7.58726C81.8208 4.16554 83.9086 1.70865 86.9533 0.633101C91.3953 -0.935406 97.2027 0.511839 99.8968 3.86765C98.8608 5.10401 97.809 6.36145 96.6886 7.70061C96.3169 7.35 95.9637 6.98358 95.5735 6.65933C93.7678 5.16464 91.7511 4.42388 89.3891 5.01438C88.2134 5.30963 87.5043 6.08202 87.2881 7.26038C87.1194 8.19357 87.7257 9.2243 88.9041 9.70408C90.4252 10.3262 92.0306 10.7348 93.5701 11.3121C94.9013 11.8104 96.2642 12.2954 97.4874 12.9993C100.095 14.5045 100.698 17.2356 100.295 19.8084C99.7571 23.2381 97.5401 25.2231 94.3372 25.9744C90.296 26.9234 86.3629 26.4832 82.7777 24.1739C82.4851 23.9841 82.1925 23.789 81.9289 23.5623C81.5387 23.2249 81.1723 22.8585 80.7637 22.4736L80.7716 22.4789Z"
                fill="white" />
              <path
                d="M181.584 39.7641C180.332 38.2457 178.695 37.3468 176.728 36.9856C175.592 36.7773 174.54 36.9698 173.567 37.5049C172.03 38.3511 171.804 40.2281 173.185 41.3036C173.952 41.8994 174.914 42.2895 175.842 42.6243C177.514 43.2254 179.264 43.6129 180.906 44.2719C183.187 45.184 184.842 46.8316 185.153 49.3386C185.633 53.2005 184.207 56.3797 180.113 57.7189C174.727 59.4825 169.927 58.2567 165.585 54.5661C166.771 53.0714 167.873 51.6795 169.033 50.2191C169.268 50.4932 169.463 50.712 169.65 50.9361C171.59 53.2691 174.145 53.9993 177.047 53.6909C177.661 53.625 178.299 53.3007 178.816 52.9369C180.131 52.009 180.023 49.5416 178.499 49.0012C176.992 48.466 175.476 47.9652 173.971 47.4247C172.79 47.003 171.569 46.6471 170.454 46.0882C166.16 43.9424 165.87 39.0154 167.981 35.7809C169.428 33.5639 171.59 32.5332 174.11 32.2432C178.08 31.7871 181.644 32.7414 184.581 35.5858C184.673 35.6754 184.731 35.7967 184.818 35.9206C183.753 37.1912 182.691 38.4566 181.592 39.7667L181.584 39.7641Z"
                fill="white" />
              <path
                d="M156.526 4.76928C155.355 5.83428 154.156 6.92565 152.875 8.09082C151.056 6.35887 148.868 4.99862 146.045 5.33078C144.044 5.56539 142.42 6.55659 141.157 8.11455C138.471 11.4308 138.982 16.1232 141.777 18.9517C144.139 21.3427 148.781 22.5606 153.249 18.2084C154.435 19.4131 155.624 20.6178 156.824 21.8357C153.146 26.2723 146.936 27.5588 141.745 25.3998C136.444 23.1933 133.243 17.8129 133.85 11.7551C134.39 6.36415 137.73 1.8537 143.843 0.356369C149.105 -0.935343 154.557 1.45564 156.526 4.77191V4.76928Z"
                fill="white" />
              <path d="M200.505 25.7819V0.567139H206.009V20.7732H217.54V25.7819H200.505Z" fill="white" />
              <path d="M81.9922 32.7048H87.449V52.8924H98.7634V57.8906H81.9922V32.7048Z" fill="white" />
              <path d="M161.33 0.545898H166.932V25.7686H161.33V0.545898Z" fill="white" />
              <path d="M108.693 57.9431H103.305V32.7573H108.693V57.9431Z" fill="white" />
              <path
                d="M149.102 69.4338V75.5365H147.33V65.6773H149.059C150.536 67.6676 152.08 69.7528 153.807 72.0832V65.6431H155.629V75.526H153.844C152.386 73.5383 150.849 71.4426 149.315 69.3495C149.244 69.3785 149.173 69.4048 149.102 69.4338Z"
                fill="white" />
              <path
                d="M108.001 71.9014H105.745V70.1062H110.05C110.348 73.1219 108.958 75.1465 106.206 75.7739C103.897 76.3011 101.461 74.8829 100.612 72.5209C99.6817 69.9243 100.776 67.0931 103.182 65.9701C105.133 65.0606 108.331 65.4112 109.615 67.8839C109.198 68.2424 108.771 68.6088 108.254 69.0544C107.664 68.2319 106.992 67.5069 105.979 67.47C105.307 67.4437 104.548 67.5017 103.963 67.7916C102.624 68.4533 102.052 70.006 102.431 71.4823C102.811 72.9585 104.039 73.9813 105.41 73.9629C106.654 73.947 107.593 73.23 108.001 71.904V71.9014Z"
                fill="white" />
              <path
                d="M197.534 70.5466C197.545 67.6126 199.746 65.422 202.654 65.451C205.612 65.48 207.855 67.726 207.858 70.6626C207.86 73.5439 205.503 75.8901 202.62 75.8585C199.49 75.8242 197.337 73.0958 197.532 70.544L197.534 70.5466ZM205.909 70.6916C205.596 68.0555 203.748 67.2066 202.219 67.3991C200.761 67.5836 199.485 69.0124 199.477 70.5704C199.469 72.2522 200.864 73.8445 202.472 73.9842C204.08 74.1265 205.411 72.8559 205.909 70.6916Z"
                fill="white" />
              <path
                d="M131.198 71.9435V70.1035H135.36C135.726 72.9189 134.403 74.8907 131.983 75.6605C129.914 76.3169 126.951 75.0225 126.046 72.5999C125.045 69.9163 126.368 67.1194 128.369 66.0544C130.114 65.1264 133.578 65.2477 134.957 67.839C134.535 68.2213 134.095 68.6193 133.652 69.02C132.02 67.1932 131.176 67.1405 129.632 67.6651C128.245 68.1369 127.583 69.5974 127.792 71.2107C127.966 72.5367 129.068 73.6412 130.475 73.8943C131.722 74.1183 132.666 73.5437 133.533 71.9435H131.192H131.198Z"
                fill="white" />
              <path
                d="M215.944 71.9938C216.506 73.072 217.146 74.2978 217.813 75.5737H215.612C215.027 74.4612 214.444 73.3567 213.841 72.2047H212.343V75.4999H210.279V65.5853C211.69 65.5853 213.095 65.4693 214.471 65.6117C217.075 65.8806 218.259 68.0527 217.323 70.3383C217.078 70.9341 216.469 71.3822 215.944 71.9912V71.9938ZM214.697 70.2566C215.81 69.3735 215.849 69.181 215.196 67.8498C214.328 67.167 213.324 67.515 212.32 67.4464V70.2592C213.15 70.2592 213.925 70.2592 214.697 70.2592V70.2566Z"
                fill="white" />
              <path
                d="M168.309 65.5217C169.872 65.6008 171.351 65.6166 172.817 65.7669C174.209 65.9092 175.166 66.7423 175.435 68.1131C175.735 69.6262 175.445 70.9996 173.803 71.8089C174.441 73.0427 175.068 74.2606 175.735 75.5549H173.553C172.957 74.4372 172.366 73.33 171.768 72.2044H170.239V75.5364H168.307V65.5217H168.309ZM172.617 70.2905C173.263 69.8476 173.769 69.3283 173.455 68.4584C173.157 67.6307 172.48 67.4145 171.673 67.4408C171.209 67.454 170.742 67.4408 170.292 67.4408V70.2905H172.617Z"
                fill="white" />
              <path
                d="M165.342 75.5655H158.696V65.6799H165.252V67.433H160.766V69.7475H164.875V71.5348H160.781V73.6806H165.342V75.5655Z"
                fill="white" />
              <path
                d="M114.638 71.5141V73.71H119.178V75.5526H112.563V65.6592H119.046V67.3938H114.686V69.7531H118.735V71.5141H114.638Z"
                fill="white" />
              <path
                d="M144.492 73.7254V75.5206H137.839V65.6904H144.345V67.3907H139.961V69.7106H144.018V71.5453H139.966V73.728H144.49L144.492 73.7254Z"
                fill="white" />
              <path
                d="M91.5568 75.5658H89.5059C90.8687 72.2126 92.1974 68.9465 93.5392 65.646H95.3317C96.6366 68.8384 97.9863 72.1415 99.373 75.5368H97.2614C96.9714 74.9173 96.6498 74.2267 96.3335 73.5492H92.3634C92.0919 74.2214 91.8388 74.8593 91.5541 75.5658H91.5568ZM95.7008 71.7197C95.2421 70.5413 94.8441 69.5159 94.3616 68.2742C93.8819 69.5317 93.4785 70.5861 93.0462 71.7197H95.7008Z"
                fill="white" />
              <path
                d="M181.601 65.6223H183.356C184.682 68.8858 186.013 72.1678 187.384 75.5447H185.252C184.98 74.9226 184.688 74.2556 184.379 73.5518H180.441C180.18 74.1502 179.89 74.8119 179.568 75.5447H177.549C178.899 72.2416 180.232 68.9781 181.603 65.6196L181.601 65.6223ZM183.731 71.7329C183.285 70.5993 182.879 69.5607 182.389 68.3138C181.914 69.5791 181.527 70.6151 181.108 71.7329H183.728H183.731Z"
                fill="white" />
              <path
                d="M83.737 72.1885V75.5364H81.7256V65.635C83.1122 65.635 84.4672 65.519 85.7958 65.6587C88.8353 65.9804 89.6288 68.2975 88.8036 70.388C88.3344 71.5822 87.3116 72.0488 86.1306 72.1727C85.4004 72.2491 84.6543 72.1858 83.737 72.1858V72.1885ZM87.1587 68.9144C86.5049 67.4513 85.8881 67.2193 83.8029 67.5831V70.4064C86.2255 70.62 86.5814 70.4618 87.1587 68.9144Z"
                fill="white" />
              <path d="M193.305 75.55H191.228V67.436H188.392V65.6855H195.978V67.4017H193.305V75.55Z" fill="white" />
              <path
                d="M41.69 25.1677C43.2796 26.7072 45.1065 27.5587 47.1653 27.962V42.0522C44.9219 42.4925 42.9791 43.5522 41.4159 45.4845C37.1611 43.141 32.9485 40.8212 28.9521 38.62C29.0339 36.6455 29.105 34.8793 29.1894 32.8073C33.141 30.3926 37.3641 27.8118 41.6874 25.1704L41.69 25.1677Z"
                fill="white" />
            </svg>

          </div>
        </div>
      </div>
    </div>

    <ReportWindow :show="showReport" @close="showReport = false" @submit="handleSubmitReport" />
    <ToastMessage :show="toast.show" :type="toast.type" :title="toast.title" :message="toast.message"
      @close="closeToast"  class="text-black"/>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../store/auth'
import ReportWindow from '../components/reports/reportWindow.vue'
import LanguageSwitcher from '../components/LanguageSwitcher.vue'
import ToastMessage from '../components/alerts/toastMessage.vue'

const { t } = useI18n()

// Import all available icons statically for Vite
import facebookIcon from '../assets/icons/facebook.svg'
import linkedinIcon from '../assets/icons/linkedin.svg'
import youtubeIcon from '../assets/icons/youtube.svg'
import twitterIcon from '../assets/icons/twitter.svg'
import instagramIcon from '../assets/icons/instagram.svg'
import githubIcon from '../assets/icons/github.svg'
import discordIcon from '../assets/icons/discord.svg'
import { userService, userLinksService, userReportService } from '../services/user'

const openLink = (rawUrl: string) => {
  if (!rawUrl) return

  // ensure it has protocol
  const url = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`

  window.open(url, '_blank', 'noopener,noreferrer')
}

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const showReport = ref(false);
const isSubmittingReport = ref(false);

// Toast state
const toast = ref({
  show: false,
  type: 'info' as 'success' | 'error' | 'info',
  title: '',
  message: ''
});

const showToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
  toast.value = { show: true, type, title, message };
};

const closeToast = () => {
  toast.value.show = false;
};

// Get user ID from route params
const userId = computed(() => route.params.id as string || '')

// Loading and error states
const isLoading = ref(false)
const error = ref<string | null>(null)

// User profile data
const userName = ref<string>('')
const userDescription = ref<string>('')
const userProfileImage = ref<string>('')
const userTag = ref<string>('')

const handleReportClick = () => {
  // Check if user is authenticated
  authStore.syncAuthState()
  if (!authStore.isAuthenticated) {
    // Redirect to login with return URL
    router.push({
      name: 'login',
      query: { redirect: route.fullPath }
    })
    return
  }
  // User is authenticated, show report window
  showReport.value = true
}

const handleSubmitReport = async (payload: {
  title: string;
  description: string;
  type: string;
}) => {
  // Double check authentication before submitting
  authStore.syncAuthState()
  if (!authStore.isAuthenticated) {
    showToast('error', 'Authentication Required', t('socialLinks.pleaseLoginToReport'));
    router.push({
      name: 'login',
      query: { redirect: route.fullPath }
    })
    return
  }

  if (!userId.value) {
    showToast('error', 'Missing Information', t('socialLinks.userIdRequired'));
    return
  }

  // Validate report payload
  const validationError = userReportService.validateReport({
    user_id: userId.value,
    title: payload.title,
    description: payload.description,
    report_type: payload.type
  })

  if (validationError) {
    showToast('error', 'Validation Error', validationError);
    return
  }

  if (isSubmittingReport.value) {
    return // Prevent multiple submissions
  }

  isSubmittingReport.value = true

  try {
    // Call the service to submit the report
    await userReportService.submitReport({
      user_id: userId.value, // The user being reported
      title: payload.title,
      description: payload.description,
      report_type: payload.type
    });

    // Show success message
    showToast('success', 'Success', 'Report submitted successfully. Thank you for your feedback.');

    // Close the report window
    showReport.value = false;
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to submit report. Please try again.';
    showToast('error', 'Error', errorMessage);
  } finally {
    isSubmittingReport.value = false
  }
};

interface SocialLink {
  title: string
  description: string
  link: string
  platform: string
  icon: string
}

// Theme variable: 1 = Facebook, 2 = LinkedIn, 3 = YouTube, 4 = Graphic Designer
// This comes from the API
const themeNumber = ref(1) // Will be replaced with theme ID from API

const socialLinks = ref<SocialLink[]>([])

// Fetch user info to get theme ID and profile image
const fetchUserInfo = async () => {
  if (!userId.value) {
    return
  }

  try {
    // Fetch user by ID directly
    const userData = await userService.getUserById(userId.value)

    // Get user info from /users/{id} endpoint (independent of button links)
    // Set profile_image, name, and description from user data
    if (userData.profile_image) {
      userProfileImage.value = userData.profile_image
    }

    // Set name and description if available (so they work even without button links)
    if (userData.name) {
      userName.value = userData.name
    }
    if (userData.description || userData.subtitle) {
      userDescription.value = userData.description || userData.subtitle || ''
    }
    // Set user tag if available (check all possible field names from API)
    if (userData.usertag) {
      userTag.value = userData.usertag
    } else if (userData.tag) {
      userTag.value = userData.tag
    } else if (userData.role) {
      userTag.value = userData.role
    }

    // Get theme_id from theme object
    const themeId = userData.theme?.theme_id

    if (themeId !== undefined && themeId !== null) {
      themeNumber.value = parseInt(String(themeId))
    } else {
      themeNumber.value = 1 // Default to theme 1
    }
  } catch (err: any) {
    themeNumber.value = 1 // Default to theme 1 on error
  }
}

// Fetch user's button links from API (includes user info in response)
const fetchUserLinks = async () => {
  if (!userId.value) {
    error.value = 'User ID is required'
    return
  }

  try {
    isLoading.value = true
    error.value = null

    // Get visible button links sorted by order
    const visibleLinks = await userLinksService.getVisibleButtonLinks(userId.value)

    if (visibleLinks.length > 0) {
      // Extract user data from button links (if available)
      const userButtonLinks = await userLinksService.getUserButtonLinks(userId.value)
      const extractedUserData = userLinksService.extractUserData(userButtonLinks)

      if (extractedUserData) {
        if (!userName.value) {
          userName.value = extractedUserData.name || ''
        }
        if (!userDescription.value) {
          userDescription.value = extractedUserData.description || ''
        }

        // Set user tag if available (check all possible field names from API)
        if (!userTag.value) {
          if (extractedUserData.usertag) {
            userTag.value = extractedUserData.usertag
          } else if (extractedUserData.tag) {
            userTag.value = extractedUserData.tag
          } else if (extractedUserData.role) {
            userTag.value = extractedUserData.role
          }
        }
      }

      // Map to SocialLink format
      socialLinks.value = visibleLinks.map((link) => ({
        title: link.title,
        description: link.description,
        link: link.link,
        platform: link.platform,
        icon: link.icon
      }))
    } else {
      // No links found, but user info (name, description, profile_image) 
      // should already be set from fetchUserInfo() which is called first
      // So we don't clear them - they are independent of button links
      socialLinks.value = []
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to fetch user links'
    socialLinks.value = []
    // Don't clear user info (name, description, profile_image) on error
    // They are set from fetchUserInfo() and should remain even if button links fail
  } finally {
    isLoading.value = false
  }
}

// Fetch user data - fetch user info first to get theme, then fetch button links
const fetchUserData = async () => {
  // Fetch user info first to get theme
  await fetchUserInfo()
  // Then fetch button links
  await fetchUserLinks()
}

// Fetch user data when component mounts or route changes
onMounted(() => {
  if (userId.value) {
    fetchUserData()
  }
})

// Watch for route changes (user ID changes)
watch(() => route.params.id, (newId) => {
  if (newId) {
    fetchUserData()
  }
})

// Theme-based color classes (computed)
const themeBgClass = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'from-blue-50 via-sky-100 to-blue-50'
    case 2: return 'from-blue-950 via-slate-900 to-blue-900'
    case 3: return 'from-purple-950 via-black to-purple-900'
    case 4: return 'from-red-950 via-black to-red-900'
    default: return 'from-blue-50 via-sky-100 to-blue-50'
  }
})

const themeBgOverlayClass = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'from-blue-400/20 via-sky-300/15 to-blue-500/20'
    case 2: return 'from-blue-600/20 via-blue-800/15 to-blue-900/20'
    case 3: return 'from-purple-600/20 via-purple-800/15 to-purple-900/20'
    case 4: return 'from-red-600/20 via-red-800/15 to-red-900/20'
    default: return 'from-blue-400/20 via-sky-300/15 to-blue-500/20'
  }
})

const themeOrb1Class = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'bg-blue-400'
    case 2: return 'bg-blue-600'
    case 3: return 'bg-purple-600'
    case 4: return 'bg-red-600'
    default: return 'bg-blue-400'
  }
})

const themeOrb2Class = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'bg-sky-300'
    case 2: return 'bg-blue-500'
    case 3: return 'bg-purple-500'
    case 4: return 'bg-red-500'
    default: return 'bg-sky-300'
  }
})

const themeOrb3Class = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'bg-blue-500'
    case 2: return 'bg-blue-700'
    case 3: return 'bg-purple-700'
    case 4: return 'bg-red-700'
    default: return 'bg-blue-500'
  }
})

const themeOrb4Class = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'bg-blue-300'
    case 2: return 'bg-blue-400'
    case 3: return 'bg-purple-400'
    case 4: return 'bg-red-400'
    default: return 'bg-blue-300'
  }
})

const themeGradientClass = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'from-blue-400 via-sky-400 to-blue-500'
    case 2: return 'from-blue-500 via-blue-600 to-blue-700'
    case 3: return 'from-purple-400 via-purple-500 to-purple-600'
    case 4: return 'from-red-400 via-red-500 to-red-600'
    default: return 'from-blue-400 via-sky-400 to-blue-500'
  }
})

const themeGradientRingsClass = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'from-blue-400 via-blue-500 to-sky-500'
    case 2: return 'from-blue-500 via-blue-600 to-blue-700'
    case 3: return 'from-purple-500 via-purple-600 to-purple-700'
    case 4: return 'from-red-500 via-red-600 to-red-700'
    default: return 'from-blue-400 via-blue-500 to-sky-500'
  }
})

const themeBorderClass = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'border-blue-400'
    case 2: return 'border-blue-400'
    case 3: return 'border-purple-400'
    case 4: return 'border-red-400'
    default: return 'border-blue-400'
  }
})

const themeTextClass = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'text-blue-400'
    case 2: return 'text-blue-400'
    case 3: return 'text-purple-400'
    case 4: return 'text-red-400'
    default: return 'text-blue-400'
  }
})

const themeTextHoverClass = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'group-hover:text-blue-400'
    case 2: return 'group-hover:text-blue-400'
    case 3: return 'group-hover:text-purple-400'
    case 4: return 'group-hover:text-red-400'
    default: return 'group-hover:text-blue-400'
  }
})

const themeHoverBorderClass = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'hover:border-blue-400'
    case 2: return 'hover:border-blue-400'
    case 3: return 'hover:border-purple-400'
    case 4: return 'hover:border-red-400'
    default: return 'hover:border-blue-400'
  }
})

const themeLoadingBorder1Class = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'border-blue-500'
    case 2: return 'border-blue-600'
    case 3: return 'border-purple-500'
    case 4: return 'border-red-500'
    default: return 'border-blue-500'
  }
})

const themeLoadingBorder2Class = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'border-sky-300'
    case 2: return 'border-blue-500'
    case 3: return 'border-purple-600'
    case 4: return 'border-red-600'
    default: return 'border-sky-300'
  }
})

const themeLoadingBorder3Class = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'border-blue-400'
    case 2: return 'border-blue-400'
    case 3: return 'border-purple-400'
    case 4: return 'border-red-400'
    default: return 'border-blue-400'
  }
})

const themeProfileBorderClass = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'border-blue-400/40'
    case 2: return 'border-blue-400/40'
    case 3: return 'border-purple-400/40'
    case 4: return 'border-red-400/40'
    default: return 'border-blue-400/40'
  }
})

const themeProfileShadowClass = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'shadow-blue-500/50'
    case 2: return 'shadow-blue-600/50'
    case 3: return 'shadow-purple-500/50'
    case 4: return 'shadow-red-500/50'
    default: return 'shadow-blue-500/50'
  }
})

const themeBadgeBorderClass = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'border-blue-400/50'
    case 2: return 'border-blue-400/50'
    case 3: return 'border-purple-400/50'
    case 4: return 'border-red-400/50'
    default: return 'border-blue-400/50'
  }
})

const themeBadgeShadowClass = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'shadow-blue-500/50'
    case 2: return 'shadow-blue-600/50'
    case 3: return 'shadow-purple-500/50'
    case 4: return 'shadow-red-500/50'
    default: return 'shadow-blue-500/50'
  }
})

const themeUnderlineShadowClass = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'shadow-blue-500/50'
    case 2: return 'shadow-blue-600/50'
    case 3: return 'shadow-purple-500/50'
    case 4: return 'shadow-red-500/50'
    default: return 'shadow-blue-500/50'
  }
})

const themeLinkHoverBorderClass = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'hover:border-blue-400/60'
    case 2: return 'hover:border-blue-400/60'
    case 3: return 'hover:border-purple-400/60'
    case 4: return 'hover:border-red-400/60'
    default: return 'hover:border-blue-400/60'
  }
})

const themeLinkShadowClass = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'hover:shadow-blue-500/40'
    case 2: return 'hover:shadow-blue-600/40'
    case 3: return 'hover:shadow-purple-500/40'
    case 4: return 'hover:shadow-red-500/40'
    default: return 'hover:shadow-blue-500/40'
  }
})

const themeIconShadowClass = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'shadow-blue-500/30'
    case 2: return 'shadow-blue-600/30'
    case 3: return 'shadow-purple-500/30'
    case 4: return 'shadow-red-500/30'
    default: return 'shadow-blue-500/30'
  }
})

const themeFooterBorderClass = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'border-blue-500/20'
    case 2: return 'border-blue-600/20'
    case 3: return 'border-purple-500/20'
    case 4: return 'border-red-500/20'
    default: return 'border-blue-500/20'
  }
})

const themeFooterShadowClass = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'shadow-blue-500/10'
    case 2: return 'shadow-blue-600/10'
    case 3: return 'shadow-purple-500/10'
    case 4: return 'shadow-red-500/10'
    default: return 'shadow-blue-500/10'
  }
})

const themeReportButtonBorderClass = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'border-blue-500/40 hover:border-blue-400'
    case 2: return 'border-blue-600/40 hover:border-blue-400'
    case 3: return 'border-purple-500/40 hover:border-purple-400'
    case 4: return 'border-red-500/40 hover:border-red-400'
    default: return 'border-blue-500/40 hover:border-blue-400'
  }
})

const themeReportButtonShadowClass = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'shadow-blue-500/20'
    case 2: return 'shadow-blue-600/20'
    case 3: return 'shadow-purple-500/20'
    case 4: return 'shadow-red-500/20'
    default: return 'shadow-blue-500/20'
  }
})

const themeReportButtonGradientClass = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'from-blue-500/0 to-sky-300/0 group-hover:from-blue-500/30 group-hover:to-sky-300/30'
    case 2: return 'from-blue-600/0 to-blue-500/0 group-hover:from-blue-600/30 group-hover:to-blue-500/30'
    case 3: return 'from-purple-500/0 to-purple-600/0 group-hover:from-purple-500/30 group-hover:to-purple-600/30'
    case 4: return 'from-red-500/0 to-red-600/0 group-hover:from-red-500/30 group-hover:to-red-600/30'
    default: return 'from-blue-500/0 to-sky-300/0 group-hover:from-blue-500/30 group-hover:to-sky-300/30'
  }
})

const themeBackButtonGradientClass = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'from-blue-500/0 to-sky-300/0 group-hover:from-blue-500/30 group-hover:to-sky-300/30'
    case 2: return 'from-blue-600/0 to-blue-500/0 group-hover:from-blue-600/30 group-hover:to-blue-500/30'
    case 3: return 'from-purple-500/0 to-purple-600/0 group-hover:from-purple-500/30 group-hover:to-purple-600/30'
    case 4: return 'from-red-500/0 to-red-600/0 group-hover:from-red-500/30 group-hover:to-red-600/30'
    default: return 'from-blue-500/0 to-sky-300/0 group-hover:from-blue-500/30 group-hover:to-sky-300/30'
  }
})

const themeLinkGradientHoverClass = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'from-blue-500/0 via-sky-300/0 to-blue-500/0 group-hover:from-blue-500/30 group-hover:via-sky-300/30 group-hover:to-blue-500/30'
    case 2: return 'from-blue-600/0 via-blue-500/0 to-blue-600/0 group-hover:from-blue-600/30 group-hover:via-blue-500/30 group-hover:to-blue-600/30'
    case 3: return 'from-purple-600/0 via-purple-500/0 to-purple-700/0 group-hover:from-purple-600/30 group-hover:via-purple-500/30 group-hover:to-purple-700/30'
    case 4: return 'from-red-600/0 via-red-500/0 to-red-700/0 group-hover:from-red-600/30 group-hover:via-red-500/30 group-hover:to-red-700/30'
    default: return 'from-blue-500/0 via-sky-300/0 to-blue-500/0 group-hover:from-blue-500/30 group-hover:via-sky-300/30 group-hover:to-blue-500/30'
  }
})

const themeCorner1Class = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'from-blue-500/0 to-transparent group-hover:from-blue-500/40'
    case 2: return 'from-blue-600/0 to-transparent group-hover:from-blue-600/40'
    case 3: return 'from-purple-500/0 to-transparent group-hover:from-purple-500/40'
    case 4: return 'from-red-500/0 to-transparent group-hover:from-red-500/40'
    default: return 'from-blue-500/0 to-transparent group-hover:from-blue-500/40'
  }
})

const themeCorner2Class = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'from-sky-300/0 to-transparent group-hover:from-sky-300/40'
    case 2: return 'from-blue-500/0 to-transparent group-hover:from-blue-500/40'
    case 3: return 'from-purple-600/0 to-transparent group-hover:from-purple-600/40'
    case 4: return 'from-red-600/0 to-transparent group-hover:from-red-600/40'
    default: return 'from-sky-300/0 to-transparent group-hover:from-sky-300/40'
  }
})

const themeCorner3Class = computed(() => {
  switch (themeNumber.value) {
    case 1: return 'from-blue-400/0 to-transparent group-hover:from-blue-400/20'
    case 2: return 'from-blue-400/0 to-transparent group-hover:from-blue-400/20'
    case 3: return 'from-purple-400/0 to-transparent group-hover:from-purple-400/20'
    case 4: return 'from-red-400/0 to-transparent group-hover:from-red-400/20'
    default: return 'from-blue-400/0 to-transparent group-hover:from-blue-400/20'
  }
})

// Format tag name function (using service)
const formatTagName = (tagName: string): string => {
  return userService.formatTagName(tagName);
};

// Icon map for static imports (Vite requires static imports)
const iconMap: Record<string, string> = {
  facebook: facebookIcon,
  linkedin: linkedinIcon,
  youtube: youtubeIcon,
  twitter: twitterIcon,
  instagram: instagramIcon,
  github: githubIcon,
  discord: discordIcon,
  // Add more icons here as they become available
  // soundcloud: soundcloudIcon,
  // snapchat: snapchatIcon,
}

const getIconPath = (iconName?: string) => {
  if (!iconName) {
    return facebookIcon // Default icon
  }

  // Convert icon name to lowercase and trim whitespace
  let normalizedIcon = iconName.toLowerCase().trim()

  // Remove .svg extension if already present
  if (normalizedIcon.endsWith('.svg')) {
    normalizedIcon = normalizedIcon.replace(/\.svg$/, '')
  }

  // Return icon from map or default to facebook
  return iconMap[normalizedIcon] || facebookIcon
}

const goToHome = () => {
  router.push({ name: 'home' })
}
</script>
