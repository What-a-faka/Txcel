<template>
  <div class="txcel">
    <el-table
      ref="tableOrigin"
      border
      v-bind="options"
      :data="data"
      @sort-change="handleSortChange"
      @selection-change="handleRowSelect"
    >
      <el-table-column
        v-if="rowSelection"
        v-bind="rowSelection.options"
        type="selection"
        align="center"
      ></el-table-column>

      <template v-for="col in columns">
        <el-table-column
          v-if="col.component"
          :key="col.prop"
          :label="col.label"
          :prop="col.prop"
          :sortable="col.sortable"
          :formatter="col.formatter"
          :resizable="col.resizable || false"
          :width="col.width"
          :header-align="col.headerAlign || 'center'"
          :align="col.align || 'center'"
          :min-width="col.minWidth"
          :show-overflow-tooltip="col.showOverflowTooltip || false"
          :fixed="col.fixed"
        >
          <template slot-scope="scope">
            <component
              :is="genColComponent(col, scope)"
              :row="scope.row"
              :column="col"
            ></component>
          </template>
        </el-table-column>

        <slot v-else-if="col.slot" :name="col.slot"></slot>

        <el-table-column
          v-else
          :key="col.prop"
          :label="col.label"
          :prop="col.prop"
          :sortable="col.sortable"
          :formatter="col.formatter"
          :resizable="col.resizable"
          :width="col.width"
          :min-width="col.minWidth"
          :header-align="col.headerAlign || 'center'"
          :align="col.align || 'center'"
          :show-overflow-tooltip="col.showOverflowTooltip || false"
          :fixed="col.fixed"
        ></el-table-column>
      </template>
    </el-table>

    <el-pagination
      v-if="pager"
      v-bind="pageOptions"
      background
      class="txcel_pager"
      :layout="pager.layout"
      :current-page="pagination.page"
      :page-size="pagination.page_size"
      :total="pager.total"
      @current-change="(val) => handlePagerChange('page', val)"
      @size-change="(val) => handlePagerChange('size', val)"
    ></el-pagination>
  </div>
</template>

<script>
import { Table, Pagination, TableColumn } from 'element-ui'

export default {
  name: 'Txcel',

  /* eslint-disable */
  components: {
    [Table.name]: Table,
    [Pagination.name]: Pagination,
    [TableColumn.name]: TableColumn,
  },

  provide() {
    return {
      emitCell: this.emitCell,
    }
  },

  props: {
    data: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: [Array, Boolean],
      default: false,
    },
    rowSelection: {
      type: [Object, Boolean],
      default: false,
    },
    pager: {
      type: [Object, Boolean],
      default: () => ({
        layout: 'total,prev,pager,next,jumper',
        page: 1,
        page_size: 10,
        total: 0,
      }),
    },
    options: {
      type: Object,
      default: () => ({}),
    },
    pageOptions: {
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    pagination() {
      return {
        page: this.pager.page,
        page_size: this.pager.page_size,
      }
    },
  },

  methods: {
    getTable() {
      return this.$refs.tableOrigin
    },

    handlePagerChange(type, nextVal) {
      const newPager = { ...this.pagination }

      if (type === 'page') {
        newPager.page = nextVal
      }

      if (type === 'size') {
        newPager.page_size = nextVal
        const curMaxPage = Math.ceil(this.pager.total / newPager.page_size)
        newPager.page = curMaxPage >= newPager.page ? newPager.page : curMaxPage
      }

      this.$emit(
        'change',
        newPager, // pagination
        null // ordering
      )
    },

    handleSortChange(sortInfo) {
      this.$emit(
        'change',
        null, // pagination
        sortInfo // ordering
      )
    },

    handleRowSelect(nextSelected) {
      this.rowSelection.onChange(nextSelected)
    },

    emitCell(prop, data = {}) {
      this.$emit('cellChange', prop, data)
    },

    genColComponent(col, scope) {
      const render = col.render
      const component = col.component
      // 兼容老的component写法
      if (
        component &&
        Object.prototype.toString(component) === '[object Object]'
      ) {
        return component
      }

      // render的写法，更简洁
      if (render && typeof render === 'function') {
        return {
          inject: ['emitCell'], // 可以使用emitCell抛出事件
          render: (h) => render(h, scope),
        }
      }
    },
  },
}
</script>

<style>
.txcel_pager {
  margin-top: 24px;
  text-align: right;
}
</style>
