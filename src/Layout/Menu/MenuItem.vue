<template>
  <div v-if="item.meta && !item.meta.hidden">
    <template v-if="theOnlyOnechild && !theOnlyOnechild.children">
      <router-link
        v-if="theOnlyOnechild.meta"
        :to="resolvePath(theOnlyOnechild.path)"
      >
        <el-menu-item :index="resolvePath(theOnlyOnechild.path)">
          <i
            v-if="theOnlyOnechild.meta.icon"
            :class="theOnlyOnechild.meta.icon"
          />
          <span v-if="theOnlyOnechild.meta.title">
            {{ theOnlyOnechild.meta.title }}
          </span>
        </el-menu-item>
      </router-link>
    </template>

    <el-submenu v-else :index="resolvePath(item.path)">
      <template slot="title">
        <i v-if="item.meta && item.meta.icon" :class="item.meta.icon" />
        <span v-if="item.meta && item.meta.title">
          {{ item.meta.title }}
        </span>
      </template>

      <template v-if="item.children">
        <sidebar-item
          v-for="child in item.children"
          :key="child.path"
          :item="child"
          :base-path="resolvePath(child.path)"
        />
      </template>
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'

export default {
  name: 'SidebarItem',
  props: {
    item: {
      type: Object,
      required: true
    },
    basePath: {
      type: String,
      required: true
    }
  },
  data () {
    return {}
  },
  computed: {
    getChildrenNumber () {
      return !this.item.children
        ? 0
        : this.item.children.filter((route) => {
          if (route.meta && route.meta?.hidden) return false
          return true
        }).length
    },
    theOnlyOnechild () {
      return this.getChildrenNumber > 1
        ? null
        : this.item.children
          ? this.item.children.find(
            (child) => !child.meta || !child.meta?.hidden
          ) || null
          : { ...this.item, path: '' }
    }
  },
  methods: {
    resolvePath (routePath) {
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>

<style lang="scss">
.el-submenu [class^="el-icon-"],
.el-menu-item [class^="el-icon-"] {
  display: inline-block;
  height: 24px;
  line-height: 24px;
}

.el-submenu span,
.el-menu-item span {
  display: inline-block;
  height: 24px;
  line-height: 25px;
}
</style>
