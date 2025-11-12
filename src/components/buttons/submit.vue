<template>
    <div class="w-full grid place-content-center">
        <button
        type="submit"
        class="w-full cursor-pointer bg-[#009AFF] text-white font-bold py-1.5 px-9 rounded-[10px] hover:bg-[#009AFF]/80 transition-colors"
        >
        <slot>Submit</slot>
        </button>
    </div>
</template>