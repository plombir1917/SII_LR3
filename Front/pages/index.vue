<template>
  <main>
    <h1>Лабораторная работа №3</h1>
    <div v-if="type==='one'">
      <select v-model="selectDefinitions" name="" id="">
        <option value="Выберите уровень финансирования">Выберите уровень финансирования</option>
        <option v-for="(d,index) in input.financing?.definitions" :value="index">{{d.name}}</option>
      </select>
    </div>
    <div v-else>
      <select v-for="(set,i) in input" v-if="i!=='degree_satisfaction'" v-model="selectDefinitions[i]" :name="i" :id="i">
        <option :for="i" value="Выберите уровень финансирования">Выберите уровень финансирования</option>
        <option @click="selectDefinitionsMultiple()" :for="i" v-for="(d,index) in set" :value="d.value">{{d.name}}</option>
      </select>
    </div>
    <div class="type">
      <input v-model="type" id="one" type="radio" value="one" name="type">
      <label for="one">Одиночный ввод</label>
      <input v-model="type" id="multiple" type="radio" value="multiple" name="type">
      <label for="multiple">Множественный ввод</label>
    </div>
    <div class="algorithm">
      <input v-model="algorithm" id="individual" type="radio" value="individual" name="algorithm">
      <label for="individual">Индивидуальные выходы</label>
      <input v-model="algorithm" id="aggregation" type="radio" value="aggregation" name="algorithm">
      <label for="aggregation">Первоначальная аггрегация</label>
      <input v-model="algorithm" id="background" type="radio" value="background" name="algorithm">
      <label for="background">Уровень истинности предпосылки</label>
    </div>
    <div class="fuzzy-matches">
      <input v-model="fuzzy" id="Mamdani" type="radio" value="Mamdani" name="fuzzy">
      <label for="Mamdani">Мамдани</label>
      <input v-model="fuzzy" id="Larsen" type="radio" value="Larsen" name="fuzzy">
      <label for="Larsen">Ларсен</label>
    </div>
    <button @click="calc()">Рассчиать</button>
    <div class="result">
      <h3>Уровень удволетворённости населения</h3>
      <p>{{res.substring(0,res.length-1)}}</p>
    </div>
  </main>
</template>

<script>
export default {
  data(){
    return{
      fuzzy:'Mamdani',
      algorithm:"individual",
      selectDefinitions:'',
      type:'one',
      res:'',
      input:{},
      rules:{}
    }
  },
  watch:{
    async type(){
      if(this.type==='one'){
          this.fuzzy='Mamdani'
          this.algorithm="individual"
          this.selectDefinitions=''
          this.type='one'
          this.res=''
          this.input={}
          this.rules={}
        await this.getAll()
      }
      else{
        this.selectDefinitions=[]
        this.$set(this.$data, 'input', {})
        this.$set(this.$data, 'rules', {})
        await this.getAll()
        console.log(this.input)
        for (let i = 0; i < this.input.length; i++) {
          this.selectDefinitions.push([])
        }
      }
    }
  },
  methods:{
    async getAll(){
      const {data} = await this.$axios.get('http://localhost:3001',{params:{type:this.type}})
      await console.log(data)
      await this.$set(this.$data,'input', data.input)
      await this.$set(this.$data,'rules', data.rules)
    },
    async calc(){
      const {data} = await this.$axios.post('http://localhost:3001',{fuzzy:this.fuzzy,algorithm:this.algorithm,type:this.type,definition:this.selectDefinitions})
      this.res=data
    },
  },
  mounted() {
    this.getAll()
  }
}
</script>
<style>
*{
  padding: 0;
  margin: 0;
  border: none;
  outline: none;
}
body{
  min-width: 100vw;
  min-height: 100vh;
}
main{
  width: fit-content;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
