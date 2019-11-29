import { app } from "@arkecosystem/core-container";
import { State } from "@arkecosystem/core-interfaces";
import { Interfaces, Utils } from "@arkecosystem/crypto";

export const transformWallet = (wallet: State.IWallet) => {
    const username: string = wallet.getAttribute("delegate.username");
    const multiSignature: Interfaces.IMultiSignatureAsset = wallet.getAttribute("multiSignature");

    // TODO: cleanup V3
    let business: any;
    if (app.has("core-magistrate-transactions")) {
        business = wallet.getAttribute("business");

        if (business) {
            business = {
                ...business.businessAsset,
                publicKey: wallet.publicKey,
                resigned: business.resigned,
            };
        }
    }

    return {
        address: wallet.address,
        publicKey: wallet.publicKey,
        nonce: wallet.nonce.toFixed(),
        balance: Utils.BigNumber.make(wallet.balance).toFixed(),
        attributes: wallet.getAttributes(),

        // TODO: remove with v3
        lockedBalance: wallet.hasAttribute("htlc.lockedBalance")
            ? wallet.getAttribute("htlc.lockedBalance").toFixed()
            : undefined,
        isDelegate: !!username,
        isResigned: !!wallet.getAttribute("delegate.resigned"),
        vote: wallet.getAttribute("vote"),
        multiSignature,
    };
};
