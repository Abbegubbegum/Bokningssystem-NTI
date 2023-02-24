<script setup>
import { defineProps, ref } from "vue";
import { API_URL } from "@/main.js";
import { getAuth } from "@firebase/auth";
const props = defineProps(["user"]);

const auth = getAuth();

let name = ref(props.user.name);
let admin = ref(props.user.admin);

async function save() {
  console.log("Saving");
  let res = await fetch(API_URL + "/users", {
    headers: {
      Authorization: "Bearer " + (await auth.currentUser.getIdToken()),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: props.user._id,
      name: name.value,
      email: props.user.email,
      admin: admin.value,
    }),
    method: "PUT",
  });
}
</script>
<template>
  <div>
    <div class="user">
      <div>Användarnamn: <input type="text" v-model="name" /></div>
      <div>{{ user.email }}</div>
      <div>
        Is Admin:
        <input type="checkbox" v-model="admin" />
      </div>
      <button @click="save()">Save</button>
    </div>
  </div>
</template>

<style scoped>
.user {
  border: 1px solid black;
  padding: 1rem;
  margin-bottom: 1rem;
}
</style>
