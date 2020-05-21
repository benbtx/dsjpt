import { Loading } from 'element-ui'
import { debounce } from 'lodash'
let loading;

function startLoading() {
    loading = Loading.service({
        lock: true,
        text: '加载中……',
        background: 'rgba(0, 0, 0, 0.7)'
    })
}

function endLoading() {
    loading.close();
}
const tryCloseLoading = () => {
    if (needLoadingRequestCount === 0) {
        loading.close()
    }
}
let needLoadingRequestCount = 0

export function showFullScreenLoading() {
    if (needLoadingRequestCount === 0) {
        startLoading()
    }
    needLoadingRequestCount++
}
export function tryHideFullScreenLoading() {
    if (needLoadingRequestCount <= 0) return
    needLoadingRequestCount--
    if (needLoadingRequestCount === 0) {
        // endLoading();
        debounce(tryCloseLoading, 300)();
    }
}