<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import defaultProfile from '../../assets/images/4.jpg';
import Text from '../../components/inputs/text.vue';
import TextHeading from '../../components/textHeading.vue';
import Submit from '../../components/buttons/submit.vue';
import AuthService from '../../services/authService';
import api from '../../services/api';

const { t } = useI18n()

const user = ref(AuthService.getStoredUser())

// Map tag names to tag IDs from database
// Based on the tags table: music=1, photography=2, education=3, programming=4, etc.
const tagNameToIdMap: Record<string, number> = {
    'music': 1,
    'photography': 2,
    'education': 3,
    'programming': 4,
    'marketing': 5,
    'volunteer': 6,
    'sports': 7,
    'mobile_apps': 8,
    'doctor': 9,
    'therapist': 10,
    'web_development': 11,
    'influencer': 12,
    'travel': 13,
    'filmmaker': 14,
    'gaming': 15,
    'activist': 16,
    'scientist': 17,
    'coach': 18,
    // Also support the signup form tags
    'developer': 4, // Map to programming
    'designer': 2, // Map to photography (closest match)
    'writer': 3, // Map to education
    'photographer': 2,
    'musician': 1,
    'artist': 1, // Map to music
    'student': 3, // Map to education
    'entrepreneur': 5, // Map to marketing
}

// Map tag IDs to tag names for display
const tagIdToNameMap: Record<number, string> = {
    1: 'music',
    2: 'photography',
    3: 'education',
    4: 'programming',
    5: 'marketing',
    6: 'volunteer',
    7: 'sports',
    8: 'mobile_apps',
    9: 'doctor',
    10: 'therapist',
    11: 'web_development',
    12: 'influencer',
    13: 'travel',
    14: 'filmmaker',
    15: 'gaming',
    16: 'activist',
    17: 'scientist',
    18: 'coach',
}

// Extract tag name from user - tags is an array of tag objects with id
// Convert tag ID to tag name for display
const getUserTagName = () => {
    if (!user.value) return ''
    // Check if tags is an array (user object might have tags property even if not in type)
    const userTags = (user.value as any).tags
    if (Array.isArray(userTags) && userTags.length > 0) {
        // Get the first tag's id
        const tagId = userTags[0].id
        // Convert ID to tag name for display
        return tagIdToNameMap[tagId] || ''
    }
    return ''
}

const profileData = reactive({
    username: user.value?.username || '',
    name: user.value?.name || '',
    email: user.value?.email || '',
    phoneNumber: (user.value as any)?.phone_no || '',
    tags: getUserTagName(), // Store tag name for display, convert to ID when saving
});

// Use profile_image from user data (same as explore and social links pages)
// If no profile_image, fallback to default
const profileImage = ref((user.value as any)?.profile_image || defaultProfile);
const selectedImageFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

// Error and success messages for user display
const errorMessage = ref<string>('');
const successMessage = ref<string>('');
const isLoading = ref(false);

const handleEditClick = () => {
    fileInput.value?.click();
};

const handleImageChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    // Clear previous error
    errorMessage.value = '';
    
    if (!file) {
        selectedImageFile.value = null;
        profileImage.value = (user.value as any)?.profile_image || defaultProfile;
        return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        errorMessage.value = t('profile.invalidImageFile');
        selectedImageFile.value = null;
        profileImage.value = (user.value as any)?.profile_image || defaultProfile;
        return;
    }
    
    // Validate file size (2MB = 2 * 1024 * 1024 bytes)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
        errorMessage.value = `${t('profile.imageTooLarge')} ${(file.size / 1024 / 1024).toFixed(2)}MB`;
        selectedImageFile.value = null;
        profileImage.value = (user.value as any)?.profile_image || defaultProfile;
        return;
    }
    
    // File is valid, store it and create preview
    selectedImageFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
        profileImage.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
};

const handleSave = async () => {
    // Clear previous messages
    errorMessage.value = '';
    successMessage.value = '';
    isLoading.value = true;

    // Convert tag name to ID
    let tagIds: number[] = []
    if (profileData.tags) {
        const tagId = tagNameToIdMap[profileData.tags]
        if (tagId !== undefined) {
            tagIds = [tagId]
        }
    }

    const formData = new FormData();
    formData.append('name', profileData.name);
    formData.append('username', profileData.username);
    formData.append('email', profileData.email);
    formData.append('phone_no', profileData.phoneNumber);
    
    // Send tags as array of IDs (Laravel expects array indices starting from 1)
    tagIds.forEach((tagId, index) => {
        formData.append(`tags[${index + 1}]`, String(tagId))
    })

    // Add profile image if a new one was selected
    if (selectedImageFile.value) {
        // Validate file again before sending
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (selectedImageFile.value.size > maxSize) {
            errorMessage.value = t('profile.imageTooLarge');
            isLoading.value = false;
            return;
        }
        
        if (!selectedImageFile.value.type.startsWith('image/')) {
            errorMessage.value = t('profile.invalidImageFile');
            isLoading.value = false;
            return;
        }
        
        formData.append('profile_image', selectedImageFile.value);
    }

    try {
        const { data } = await api.post('/user/update', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (data?.data?.user) {
            localStorage.setItem('user', JSON.stringify(data.data.user));
            // Update local user ref
            user.value = data.data.user;
            // Update profile image if it was updated
            if (data.data.user.profile_image) {
                profileImage.value = data.data.user.profile_image;
            }
            successMessage.value = t('profile.profileSaved');
            errorMessage.value = '';
            
            // Clear success message after 3 seconds
            setTimeout(() => {
                successMessage.value = '';
            }, 3000);
        } else {
            errorMessage.value = 'Profile update completed, but some information may not have been saved. Please refresh the page.';
        }
    } catch (error: any) {
        // Parse error for user-friendly message
        let userFriendlyError = t('profile.failedToSaveProfile') + ' ';
        
        // Check for validation errors (Laravel format)
        if (error.response?.data?.errors) {
            const errors = error.response.data.errors;
            const fieldErrors: string[] = [];
            
            // Map field names to user-friendly labels
            const fieldLabels: Record<string, string> = {
                'name': 'Name',
                'username': 'Username',
                'email': 'Email',
                'phone_no': 'Phone Number',
                'tags': 'Tag',
                'profile_image': 'Profile Image'
            };
            
            // Collect all field errors
            Object.keys(errors).forEach(field => {
                const fieldLabel = fieldLabels[field] || field;
                const fieldError = Array.isArray(errors[field]) ? errors[field][0] : errors[field];
                fieldErrors.push(`${fieldLabel}: ${fieldError}`);
            });
            
            if (fieldErrors.length > 0) {
                userFriendlyError += fieldErrors.join('\n');
            } else {
                userFriendlyError += 'Please check all fields and try again.';
            }
        } else if (error.response?.data?.message) {
            // Use API error message if available
            userFriendlyError += error.response.data.message;
        } else if (error.response?.status === 422) {
            userFriendlyError += 'Please check all fields and make sure they are filled correctly.';
        } else if (error.response?.status === 401) {
            userFriendlyError += 'You are not authorized. Please log in again.';
        } else if (error.response?.status === 500) {
            userFriendlyError += 'Server error. Please try again later.';
        } else {
            userFriendlyError += 'Please try again. If the problem persists, contact support.';
        }
        
        errorMessage.value = userFriendlyError;
        successMessage.value = '';
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <form action="" class="flex flex-col justify-between space-y-5 pb-10 xl:mt-10">
        <div class="p-8 flex max-xl:flex-col justify-between max-lg:gap-y-8">
            <div class="flex max-xl:flex-col justify-between xl:gap-2 xl:w-1/3">
                <TextHeading>{{ t('profile.title') }}</TextHeading>
                <div class="mt-4 w-full h-2/3 flex justify-center items-end">
                    <div class="relative">
                        <img :src="profileImage" alt="Profile image" class="xl:size-60 lg:size-52 md:size-48 size-44 rounded-full object-cover" />
                        <button 
                            type="button"
                            @click="handleEditClick"
                            class="absolute xl:bottom-1 lg:-bottom-1 -bottom-2 right-0 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                        >
                            <img src="../../assets/icons/edit.svg" alt="Edit Icon" class="w-6 h-6">
                        </button>
                        <input 
                            ref="fileInput"
                            type="file" 
                            accept="image/*"
                            @change="handleImageChange"
                            class="hidden"
                        />
                    </div>
                </div>
            </div>
            <div class="xl:w-3/5 md:w-4/5 h-full space-y-4">
                <Text v-model="profileData.username" :label="t('profile.username')" :placeholder="t('profile.enterUsername')" type="text" />
                <Text v-model="profileData.name" :label="t('profile.name')" :placeholder="t('profile.enterName')" type="text" />
                <Text v-model="profileData.email" :label="t('profile.email')" :placeholder="t('profile.enterEmail')" type="email" />
                <Text v-model="profileData.phoneNumber" :label="t('profile.phoneNumber')" :placeholder="t('profile.enterPhoneNumber')" type="tel" />
                
                <!-- Tag Field -->
                <div>
                    <label class="block text-gray-700 text-sm font-medium mb-2">{{ t('profile.tag') }}</label>
                    <select
                        v-model="profileData.tags"
                        class="w-full px-4 py-3 border-b-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                        style="border-bottom-color: #009AFF;"
                    >
                        <option value="">None</option>
                        <option value="music">Music</option>
                        <option value="photography">Photography</option>
                        <option value="education">Education</option>
                        <option value="programming">Programming</option>
                        <option value="marketing">Marketing</option>
                        <option value="volunteer">Volunteer</option>
                        <option value="sports">Sports</option>
                        <option value="mobile_apps">Mobile Apps</option>
                        <option value="doctor">Doctor</option>
                        <option value="therapist">Therapist</option>
                        <option value="web_development">Web Development</option>
                        <option value="influencer">Influencer</option>
                        <option value="travel">Travel</option>
                        <option value="filmmaker">Filmmaker</option>
                        <option value="gaming">Gaming</option>
                        <option value="activist">Activist</option>
                        <option value="scientist">Scientist</option>
                        <option value="coach">Coach</option>
                    </select>
                    <p class="text-gray-600 text-xs mb-3 pt-2">
                        {{ t('profile.tagDescription') }}
                    </p>
                </div>
            </div>
            
        </div>
        
        <!-- Error and Success Messages -->
        <div class="px-8">
            <div v-if="errorMessage" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 class="text-red-800 font-semibold mb-2">{{ t('profile.updateStatus') }}</h3>
                <pre class="text-red-700 text-sm whitespace-pre-wrap">{{ errorMessage }}</pre>
            </div>
            
            <div v-if="successMessage" class="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p class="text-green-800 font-semibold">{{ successMessage }}</p>
            </div>
        </div>
        
        <div class="w-[150px] mx-auto">
            <Submit 
                :text="t('profile.saveChanges')" 
                @click="handleSave"
                :disabled="isLoading"
            />
            <p v-if="isLoading" class="text-center text-gray-600 text-sm mt-2">{{ t('profile.saving') }}</p>
        </div>
    </form>
</template>
