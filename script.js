//Script to add an array of ips using mongodb atlas web client:
// AccessList page
// https://cloud.mongodb.com/v2/<id>/security/network/accessList

//Add Ips in batch
//You need to have at least one ip already added
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function addIps(ipsArray) {
    let count = 0

    const observerBefore = new MutationObserver(function(mutations) {
        mutations.forEach(async function(mutation) {
    
            if(mutation.addedNodes.length > 0) {
                for(let i = 0; i < mutation.addedNodes.length; i++) {
                    const node = mutation.addedNodes[i];
                    if(node.nodeType == Node.ELEMENT_NODE) {
                        if(node.classList.contains('view-modal-layout')) {
                            let input = document.getElementsByName("networkPermissionEntry")[0]
                            input.value = ipsArray[count]
                            await sleep(20)
                            let confirmButton = document.getElementsByName("confirm")[0]
                            confirmButton.click()
                            count += 1
                            if(count == ipsArray.length) {
                                observerBefore.disconnect()
                                observerAfter.disconnect()
                            }

                        }
                    }
                }
            }
        })
    })
    
    let bodyMain = document.querySelector(".mms-body-main");
    observerBefore.observe(bodyMain, {
        childList: true,
        subtree: true
    });
    
    const observerAfter = new MutationObserver(function(mutations) {
        mutations.forEach(async function(mutation) {
            mutation.removedNodes.forEach(function(node) {
                if(node.nodeType == Node.ELEMENT_NODE) {
                    if(node.tagName == 'DIV') {
                        if(node.children[1] != undefined) {
                            if(node.children[1].classList.contains('view-modal-layout')) {
                                if(count < ipsArray.length) {
                                    let buttonWrapper = document.querySelector(".section-controls.section-controls-is-end-justified")
                                    let button = buttonWrapper.children[0]
                                    button.click()
                                }
    
                            }
                        }

                    }
                }
            })
        });
    });
    
    observerAfter.observe(bodyMain, {
        childList: true,
        subtree: true
    });

    if(count == 0) {
        let buttonWrapper = document.querySelector(".section-controls.section-controls-is-end-justified")
        let button = buttonWrapper.children[0]
        button.click()
    }
}

//Remove Ips 
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function deleteIps() {

    let count = 0;

    const observerBefore = new MutationObserver(function(mutations) {
        mutations.forEach(async function(mutation) {
            if(mutation.addedNodes.length > 0) {
                for(let i = 0; i < mutation.addedNodes.length; i++) {
                    const node = mutation.addedNodes[i];
                    if(node.nodeType == Node.ELEMENT_NODE) {
                        if(node.children[1] != undefined) {
                            if(node.children[1].classList.contains('view-modal-layout')) {
                                let deleteButton = document.querySelector('.button-is-danger')
                                count += 1
                                deleteButton.click()
                            }
                        }
                        
                    }
                }
            }
        })
    })

    let bodyMain = document.querySelector(".mms-body-main");

    observerBefore.observe(bodyMain, {
        childList: true,
        subtree: true
    })

    const observerAfter = new MutationObserver(function(mutations) {
        mutations.forEach(async function(mutation) {
            mutation.removedNodes.forEach(async function(node) {
                if(node.nodeType == Node.ELEMENT_NODE) {
                    if(node.tagName == 'DIV') {
                        if(node.children[1] != undefined) {
                            if(node.children[1].classList.contains('view-modal-layout')) {
                                let tableBody = document.querySelector('.js-whitelist-collection')
                                let rows = tableBody.children
                                if(rows.length == 0) {
                                    observerBefore.disconnect()
                                    observerAfter.disconnect()
                                } else {
                                    let row = rows[0]
                                    let actionsCell = row.children[3]
                                    let deleteButton = actionsCell.children[1]
                                    deleteButton.click()
                                }

                            }
                        }
                    }
                }
            })
        });
    });

    observerAfter.observe(bodyMain, {
        childList: true,
        subtree: true
    });

    if(count == 0) {
        let tableBody = document.querySelector('.js-whitelist-collection')
        let rows = tableBody.children
        let row = rows[count]
        let actionsCell = row.children[3]
        let deleteButton = actionsCell.children[1]
        deleteButton.click()
    }
}
