<script setup lang="ts">
import { reactive, ref } from 'vue';
import defaultProfile from '../../assets/images/4.jpg';
import Text from '../../components/inputs/text.vue';
import TextHeading from '../../components/textHeading.vue';
import Submit from '../../components/buttons/submit.vue';

const profileData = reactive({
    username: '',
    name: '',
    email: '',
    phoneNumber: '',
});

const profileImage = ref(defaultProfile);
const fileInput = ref<HTMLInputElement | null>(null);

const handleEditClick = () => {
    fileInput.value?.click();
};

const handleImageChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            profileImage.value = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    } else {
        profileImage.value = '../../assets/images/4.jpg';
    }
};
</script>

<template>
    <form action="" class="flex flex-col justify-between space-y-5 pb-10 xl:mt-10">
        <div class="p-8 flex max-xl:flex-col justify-between max-lg:gap-y-8">
            <div class="flex max-xl:flex-col justify-between xl:gap-2 xl:w-1/3">
                <TextHeading>Profile</TextHeading>
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
                <Text v-model="profileData.username" label="Username" placeholder="Enter your username" type="text" />
                <Text v-model="profileData.name" label="Name" placeholder="Enter your name" type="text" />
                <Text v-model="profileData.email" label="Email" placeholder="Enter your email" type="email" />
                <Text v-model="profileData.phoneNumber" label="Phone Number" placeholder="Enter your phone number" type="tel" />
            </div>
            
        </div>
        <submit>Save Changes</submit>
    </form>
</template>