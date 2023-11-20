<template>
  <main>
    <h1>Лабораторная работа №3</h1>
    <div v-if="type==='one'">
      <select v-model="selectDefinitions" name="one" id="one">
        <option disabled selected value="">Выберите уровень финансирования</option>
        <option v-for="(d,index) in input.financing?.definitions" :value="index">{{d.name}}</option>
      </select>
    </div>
    <div v-else>
      <select class="multiple-select" v-for="(set,i) in input" v-if="i!=='degree_satisfaction'" v-model="selectDefinitions[i]" :name="i" :id="i">
        <option v-show="names[i]" disabled selected value="">{{ `Выберите ${names[i]?.name}` }}</option>
        <option :for="i" v-for="(d,index) in set" :value="d.value">{{d.name}}</option>
      </select>
    </div>
    <div class="type">
      <input v-model="type" id="one" type="radio" value="one" name="type">
      <label for="one">Одиночный ввод</label>
      <input v-model="type" id="multiple" type="radio" value="multiple" name="type">
      <label for="multiple">Множественный ввод</label>
    </div>
    <div class="algorithm">
      <input :disabled="type==='multiple'" v-model="algorithm" id="individual" type="radio" value="individual" name="algorithm">
      <label for="individual">Индивидуальные выходы</label>
      <input :disabled="type==='multiple'" v-model="algorithm" id="aggregation" type="radio" value="aggregation" name="algorithm">
      <label for="aggregation">Первоначальная аггрегация</label>
      <input :checked="type==='multiple'" v-model="algorithm" id="background" type="radio" value="background" name="algorithm">
      <label for="background">Уровень истинности предпосылки</label>
    </div>
    <div class="fuzzy-matches">
      <input v-model="fuzzy" id="Mamdani" type="radio" value="Mamdani" name="fuzzy">
      <label for="Mamdani">Мамдани</label>
      <input v-model="fuzzy" id="Larsen" type="radio" value="Larsen" name="fuzzy">
      <label for="Larsen">Ларсен</label>
    </div>
    <button class="result-btn" @click="calc()">Рассчиать</button>
    <div class="result">
      <h3 v-if="res>0">Уровень удволетворённости населения</h3>
      <p v-if="res>0">{{Math.round( res *100)/100}}</p>
    </div>
    <div v-if="type === 'one'" class="edit">
      <p>Добавить правило</p>
      ЕСЛИ Финансирование =
      <select v-model="add_rules.if" name="one-edit-financing" id="one-edit-financing">
        <option disabled selected value="">Выберите уровень финансирования</option>
        <option v-for="(d,index) in input.financing?.definitions" :value="index">{{d.name}}</option>
      </select>
      ТО уровень удволетворённости населения =
      <select v-model="add_rules.then" name="one-edit-degree" id="one-edit-degree">
        <option disabled selected value="">Выберите уровень удволетворённости населения</option>
        <option v-for="(d,index) in input.degree_satisfaction?.definitions" :value="index">{{d.name}}</option>
      </select> <br>
      <button class="add-rules" @click="addRules()">Добавить</button>
    </div>
    <div v-else class="edit">
      <p>Добавить правило</p>
      ЕСЛИ
      <div v-for="(set,i) in input">
        {{names[i]?.name}} =
        <select class="multiple-select" v-if="i!=='degree_satisfaction'" v-model="add_rules_if_multiple[i]" :name="i" :id="i">
          <option v-show="names[i]" disabled selected value="">{{ `Выберите ${names[i]?.name}` }}</option>
          <option :for="i" v-for="(d,index) in set" :value="d.en_name">{{d.name}}</option>
        </select>
      </div>
      ТО Уровень удволетворённости населения = <select v-model="add_rules.then" name="one-edit-degree" id="one-edit-degree">
      <option disabled selected value="">Выберите уровень удволетворённости населения</option>
      <option v-for="(d,index) in degree_satisfaction.definitions" :value="index">{{d.name}}</option>
    </select> <br>
      <button class="add-rules" @click="addRules()">Добавить</button>
    </div>
    <div v-if="type==='one'" class="rules">
      <div  v-for="(rule,i) in rules" ><p>ЕСЛИ Уровень финансирования = {{input.financing.definitions[rule.if.financing].name}} ТО Уровень удволетворённости населения = {{input.degree_satisfaction.definitions[rule.then.degree_satisfaction].name}}</p> <button @click="deleteRules(i)">Удалить</button></div>
    </div>
    <div v-else class="rules">
      <div  v-for="(rule,i) in rules" ><p> ЕСЛИ <span v-if="inputClear?.input" v-for="(set,key,i) in rule.if">{{inputClear?.input[key]?.name}} = {{inputClear?.input[key].definitions[set].name}} {{i === Object.keys(rule.if).length-1?' ':'И'}} </span> ТО <span v-if="inputClear" v-for="(set,key,i) in rule.then">{{inputClear[key]?.name}} = {{inputClear[key].definitions[set].name}} </span>  </p> <button @click="deleteRules(i)">Удалить</button></div>
    </div>
    <div v-if="type==='one'" class="data">
      <div>
        <p>Финансирование</p>
        {{input?.financing?.value}}
        <p v-for="el in input?.financing?.definitions">{{el.name}} – {{el.value}}</p>
      </div>
      <div>
        <div>
          <p>Уровень удволетворённости населения</p>
          {{input?.degree_satisfaction?.value}}
          <p v-for="el in input?.degree_satisfaction?.definitions">{{el.name}} – {{el.value}}</p>
        </div>
      </div>
    </div>
    <div v-else class="data">
      <div v-for="inp in inputClear.input">
        <p>{{ inp.name }}</p>
        {{inp?.value}}
        <p v-for="el in inp?.definitions">{{el.name}} – {{el.value}}</p>
      </div>
      <div>
        <p>{{ inputClear.degree_satisfaction?.name }}</p>
        {{inputClear.degree_satisfaction?.value}}
        <p v-for="el in inputClear.degree_satisfaction?.definitions">{{el.name}} – {{el.value}}</p>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  data(){
    return{
      fuzzy:'Mamdani',
      algorithm:"individual",
      selectDefinitions:[],
      type:'one',
      res:'',
      input:{},
      rules:{},
      names:[],
      add_rules:{
        if:'',
        then:''
      },
      add_rules_if_multiple:[],
      degree_satisfaction:'',
      inputClear:'',
      add_set:{
        for:'',
        name:'',
        en_name:'',
        value:'',
      }
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
        for (let i = 0; i < this.input.length; i++) {
          this.selectDefinitions.push([])
          this.add_rules_if_multiple.push([])
        }
      }
    }
  },
  methods:{
    async deleteRules(i){
      await this.$axios.post('http://localhost:3001/delete-rules',{type:this.type, index:i})
      await this.getAll()
    },
    async getAll(){
      const {data} = await this.$axios.get('http://localhost:3001',{params:{type:this.type}})
      await this.$set(this.$data,'input', data.input)
      await this.$set(this.$data,'rules', data.rules)
      await data.names? this.names =data.names:''
      await data.degree_satisfaction? this.degree_satisfaction =data.degree_satisfaction:''
      await data.inputClear? this.inputClear =data.inputClear:''
    },
    async calc(){
      if (this.selectDefinitions) {
        const {data} = await this.$axios.post('http://localhost:3001', {
          fuzzy: this.fuzzy,
          algorithm: this.algorithm,
          type: this.type,
          definition: this.selectDefinitions
        })
        this.res = data
      }
    },
    async addRules(){
      if (this.type==='one' && this.add_rules.if &&  this.add_rules.then) {
        const {data} = await this.$axios.post('http://localhost:3001/add-rules', {
          type: this.type,
          json: {
            if: {
              financing: this.add_rules.if
            },
            then: {
              degree_satisfaction: this.add_rules.then
            }
          }
        })
      }
      else{
        let obj = {
          if:{},
          then:{
            degree_satisfaction:this.add_rules.then
          }
        }
        for (let i = 0; i < this.add_rules_if_multiple.length; i++) {
          obj.if[this.input[i][0].en_parent] = this.add_rules_if_multiple[i]
        }
        console.log(obj)
        const {data} = await this.$axios.post('http://localhost:3001/add-rules', {
          type: this.type,
          json:obj,
        })
      }
      await this.getAll()
    }
  },
  mounted() {
    this.getAll()
  }
}
</script>
<style>
*{
  font-family: "Helvetica Neue";
  padding: 0;
  margin: 0;
  border: none;
  outline: none;
}
body{
  min-width: 100vw;
  min-height: 100vh;
  background-color: #a4ffa4;
}
main{
  width: fit-content;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
main >div{
  margin-top: 20px;
}
.result p{
  font-size: 2rem;
  width: 100%;
  text-align: center;
}
.result-btn{
  width: 100%;
  padding: 4px 0;
  margin: 10px 0;
}
.multiple-select{
  margin: 0 4px;
}
.edit{
  width: 100%;
  padding: 10px;
  border-top: 1px #131313 solid;
}
.edit > p{
  width: 100%;
  text-align: center;
  font-size: 24px;
  font-weight: bolder;
  margin-bottom: 20px;
}
button.add-rules{
  width: 100%;
  padding: 4px 0;
  margin-top: 16px;
}
.rules div{
  display: flex;
  gap: 20px;
  margin-top: 8px;
}
.data{
  width: 100%;
  display: flex;
  gap: 40px;
  justify-content: center;
}
</style>
